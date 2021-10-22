import { defineClientAppEnhance } from '@vuepress/client';
import Options from './components/Options';
import Modal from './components/Modal';
import Basic from './components/Basic';
import Menu from './components/Menu';

export default defineClientAppEnhance(({ app }) => {
  app.component('Options', Options);
  app.component('Modal', Modal);
  app.component('Basic', Basic);
  app.component('Menu', Menu);
})
