import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ButtonElem from './Button';

export default {
  title: 'Components/Button',
  component: ButtonElem,
} as ComponentMeta<typeof ButtonElem>;

export const Button: ComponentStory<typeof ButtonElem> = (args) => <ButtonElem>Button</ButtonElem>

Button.parameters = {
    backgrounds: {default: 'dark'}
}