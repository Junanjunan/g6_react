import React, { useRef, useState } from "react";
import { useFormContext, useController } from 'react-hook-form';
import { Button, FormControl, Input, InputGroup, Text } from "@chakra-ui/react";
import { serverURL } from "../api";


export function get_img_url (bf_file: string) {
  if (!bf_file) {
    return "";
  }
  if (bf_file.startsWith("/")) {
    bf_file = bf_file.slice(1);
  }
  return `${serverURL}/${bf_file}`;
}


export default function FileUpload ({name} : {name: string}) {
  const { control, setValue } = useFormContext();
  const { field } = useController({
    name,
    control,
    defaultValue: null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setSelectedFile(file);
      setValue(name, file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormControl>
      <InputGroup>
        <Button onClick={handleButtonClick} mr={2} minWidth="70px" fontWeight={"400"}>
          File
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {selectedFile && <Text mt={2} isTruncated maxWidth="80%">{selectedFile.name}</Text>}
      </InputGroup>
    </FormControl>
  );
};