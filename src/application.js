// @ts-check
/* eslint no-param-reassign: ["error", { "props": false }] */

import i18n from 'i18next';
import onChange from 'on-change';
import resources from './locales/index';

// BEGIN (write your solution here)

/* VIEW */

function createButton({ classes, type, textContent }) {
  const btnEl = document.createElement('button');
  btnEl.classList.add(...classes);
  btnEl.setAttribute('type', type);
  btnEl.textContent = textContent;

  return btnEl;
}

function createBtnContainerEl({ classes, role }) {
  const btnContainerEl = document.createElement('div');
  btnContainerEl.classList.add(classes);
  btnContainerEl.setAttribute('role', role);

  return btnContainerEl;
}

function renderInit(
  state,
  { counterContainerEl, btnContainerEl, lngButtons, ctrlButtons }
) {
  Object.values(lngButtons).forEach((btn) => {
    btnContainerEl.append(btn);
  });

  counterContainerEl.append(btnContainerEl);

  Object.values(ctrlButtons).forEach((btn) => {
    counterContainerEl.append(btn);
  });
}

function addHandlerForBtn(state, container, handler) {
  container.addEventListener('click', handler.bind(null, state));
}

const lngChangeRenderOptions = {
  ru: (elements) => {
    elements.lngButtons.ruBtnEl.classList.add('btn-primary');
    elements.lngButtons.ruBtnEl.classList.remove('btn-outline-primary');
    elements.lngButtons.enBtnEl.classList.add('btn-outline-primary');
    elements.lngButtons.enBtnEl.classList.remove('btn-primary');
  },
  en: (elements) => {
    elements.lngButtons.ruBtnEl.classList.remove('btn-primary');
    elements.lngButtons.ruBtnEl.classList.add('btn-outline-primary');
    elements.lngButtons.enBtnEl.classList.remove('btn-outline-primary');
    elements.lngButtons.enBtnEl.classList.add('btn-primary');
  },
};

const render = (state, elements, dictionary) => (path, value) => {
  const [prop, language] = path.split('.');

  switch (prop) {
    case 'count':
      elements.ctrlButtons.clickBtnEl.textContent = dictionary.t(
        'keyWithCount',
        {
          count: value,
        }
      );
      break;
    case 'activeLanguage':
      if (value) {
        dictionary.changeLanguage(language).then((t) => {
          lngChangeRenderOptions[language](elements);

          elements.ctrlButtons.clickBtnEl.textContent = t('keyWithCount', {
            count: state.count,
          });

          elements.ctrlButtons.resetBtnEl.textContent = t('reset');
        });
      }
      break;
    default:
      break;
  }
};

/* CONTROLLER */

function handleClick(state, e) {
  const clickedEl = e.target;

  if (clickedEl.matches('.btn-outline-primary')) {
    const newRuSate = !state.activeLanguage.ru;
    const newEnState = !state.activeLanguage.en;

    state.activeLanguage.en = newEnState;
    state.activeLanguage.ru = newRuSate;

    return;
  }

  if (clickedEl.matches('.btn-info')) {
    state.count += 1;

    return;
  }

  if (clickedEl.matches('.btn-warning')) {
    state.count = 0;
  }
}

function app(dictionary, state, elements) {
  const watchedState = onChange(state, render(state, elements, dictionary));

  addHandlerForBtn(watchedState, elements.counterContainerEl, handleClick);
}

export default async function runApp() {
  const i18nextInstance = i18n.createInstance();

  await i18nextInstance.init({
    lng: 'en',
    debug: false,
    resources: {
      ...resources,
    },
  });

  const initialDomElSettings = {
    ruBtn: {
      classes: ['btn', 'mb-3', 'btn-outline-primary'],
      type: 'button',
      textContent: i18nextInstance.t('secondaryLanguage'),
    },
    enBtn: {
      classes: ['btn', 'mb-3', 'btn-primary'],
      type: 'button',
      textContent: i18nextInstance.t('defaultLanguage'),
    },
    clickBtn: {
      classes: ['btn', 'btn-info', 'mb-3', 'align-self-center'],
      type: 'button',
      textContent: i18nextInstance.t('keyWithCount', { count: 0 }),
    },
    resetBtn: {
      classes: ['btn', 'btn-warning'],
      type: 'button',
      textContent: i18nextInstance.t('reset'),
    },
    btnContainer: {
      classes: ['btn-group'],
      role: 'group',
    },
  };

  const initialState = {
    count: 0,
    activeLanguage: {
      en: true,
      ru: false,
    },
  };

  const elements = {
    lngButtons: {
      enBtnEl: createButton(initialDomElSettings.enBtn),
      ruBtnEl: createButton(initialDomElSettings.ruBtn),
    },
    ctrlButtons: {
      clickBtnEl: createButton(initialDomElSettings.clickBtn),
      resetBtnEl: createButton(initialDomElSettings.resetBtn),
    },
    btnContainerEl: createBtnContainerEl(initialDomElSettings.btnContainer),
    counterContainerEl: document.querySelector('.card'),
  };

  renderInit(initialState, elements);

  app(i18nextInstance, initialState, elements);
}
// END
