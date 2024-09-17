import { Button } from "@nextui-org/react";
import { FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl text-red-500 font-semibold">Hello world!</h1>
      <Button color="primary" startContent={<FaRegSmile size={20} />}>
        Click me
      </Button>
    </>
  );
}
