import { FC, useState } from "react";
import Button from "../Button/Button";

const Card: FC<{ title: string; text: string; color: string }> = ({ title, text, color }) => {
    const [wasClicked, setWasClicked] = useState(false);

  return (
    <div data-testid="card" className={`${color} h-[32rem] w-80 p-12 text-white flex flex-col justify-between`}>
      <div>
        <div className="flex justify-center items-center mb-9 aspect-square w-10 rounded-full bg-black bg-opacity-20"/>
        <h2 className="mb-6 font-big-shoulders text-5xl font-bold tracking-wider">{title}</h2>
        <p data-testid='card-text' className="font-lexend text-[14px] leading-6 opacity-75">{text}</p>
      </div>
      <Button onClick={() => setWasClicked(prev => !prev)}>{wasClicked ? 'clicked' : 'Click me'}</Button>
    </div>
  );
};

export default Card;
