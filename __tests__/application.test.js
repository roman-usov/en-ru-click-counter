// @ts-check

import fs from 'fs';
import path from 'path';
import testingLibrary from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import run from '../src/application';

const { screen } = testingLibrary;

const getFixture = (filename) => fs.readFileSync(path.join('__fixtures__', filename)).toString();

beforeEach(async () => {
  const initHtml = getFixture('index.html');
  document.body.innerHTML = initHtml;
  await run();
});

test('i18n', async () => {
  expect(screen.getByRole('button', { name: /0 clicks/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /русский/i }));
  expect(await screen.findByRole('button', { name: /0 кликов/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /сбросить/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /english/i }));
  expect(await screen.findByRole('button', { name: /0 clicks/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
});

test('plurals', async () => {
  await userEvent.click(screen.getByRole('button', { name: /0 clicks/i }));
  expect(screen.getByRole('button', { name: /1 click/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /1 click/i }));
  expect(screen.getByRole('button', { name: /2 clicks/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /русский/i }));
  expect(await screen.findByRole('button', { name: /2 клика/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /2 клика/i }));
  await userEvent.click(screen.getByRole('button', { name: /3 клика/i }));
  await userEvent.click(screen.getByRole('button', { name: /4 клика/i }));
  await userEvent.click(screen.getByRole('button', { name: /5 кликов/i }));
  await userEvent.click(screen.getByRole('button', { name: /сбросить/i }));
  await userEvent.click(screen.getByRole('button', { name: /0 кликов/i }));
  expect(screen.getByRole('button', { name: /1 клик/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /english/i }));
  expect(await screen.findByRole('button', { name: /1 click/i })).toBeInTheDocument();
});
