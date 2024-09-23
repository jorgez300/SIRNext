import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface EditableCellProps {
  value: string;
  row: Row<unknown>;
  columnId: string;
  updateData: ((i: number, id: string, val: string) => void) | undefined;
}

export function CeldaNumerica(props: Readonly<EditableCellProps>) {
  const initialValue = props.value;
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    if (props.updateData) {
      props.updateData(props.row.index, props.columnId, value);
    } else {
      console.error("updateData method is not available");
    }
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onKeyDown={(e) => {
        console.log(e.key, e.code);
        const regex = /^[0-9]$/;
        if (regex.test(e.key)) {
          console.log(e.key);
        } else if (e.code == "Backspace") {
          console.log(e.code);
        }
        else{
          e.preventDefault();
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

export function CeldaDecimal(props: Readonly<EditableCellProps>) {
  const initialValue = props.value;
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    if (props.updateData) {
      props.updateData(props.row.index, props.columnId, value);
    } else {
      console.error("updateData method is not available");
    }
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value}
      onKeyDown={(e) => {
        console.log(e.key, e.code);
        const regex = /^[0-9]$/;
        if (regex.test(e.key)) {
          console.log(e.key);
        } else if (e.code == "Backspace") {
          console.log(e.code);
        }
        else if (e.code == "Comma") {
          console.log(e.code);
        }
        else{
          e.preventDefault();
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}
