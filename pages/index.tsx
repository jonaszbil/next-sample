import Head from "next/head";
import Card from "../components/Card";

const cardData = [
  {
    color: "bg-amber-500",
    title: "One",
    text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, necessitatibus. Officiis ea id perferendis doloremque quibusdam voluptates!",
  },
  {
    color: "bg-teal-700",
    title: "Two",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, exercitationem optio? Architecto exercitationem natus culpa commodi, magnam?",
  },
  {
    color: "bg-teal-900",
    title: "Three",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum libero vitae dolor vel incidunt voluptatem hic eaque assumenda exercitationem est.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Sample app</title>
        <meta name="description" content="App to demo automatic deployment & testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center  bg-slate-200 py-16">
        <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-lg">
          {cardData.map((data, i) => (
            <Card key={`Card-${i}`} title={data.title} text={data.text} color={data.color}></Card>
          ))}
        </div>
      </main>
    </>
  );
}
