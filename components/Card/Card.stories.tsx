import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CardElem from './Card';

export default {
  title: 'Components/Card',
  component: CardElem,
} as ComponentMeta<typeof CardElem>;

const cardProps = {
    title: "One",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi vero ducimus nisi explicabo? Modi vero ducimus nisi explicabo!",
    color: "bg-amber-500",
  };  

export const Card: ComponentStory<typeof CardElem> = (args) => <CardElem {...args}/>

Card.args = cardProps

Card.parameters = {
    backgrounds: {default: 'light'}
}