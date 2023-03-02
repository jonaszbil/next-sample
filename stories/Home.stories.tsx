import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HomeElem from '../pages/index';

export default {
  title: 'Pages/Home',
  component: HomeElem,
} as ComponentMeta<typeof HomeElem>;


export const Home: ComponentStory<typeof HomeElem> = (args) => <HomeElem />

Home.parameters = {
    backgrounds: {default: 'light'}
}