import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 350) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      setTweet("");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={350}
        onChange={onChange}
        value={tweet}
        placeholder="what is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  border: 2px solid white;
  border-radius: 20px;
  background-color: #000;
  font-size: 1rem;
  color: white;
  resize: none;
  &::placeholder {
    font-size: 1rem;
  }
  &:focus {
    outline: none;
    border-color: yellow;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0;
  border-radius: 20px;
  border: 1px solid yellow;
  font-size: 14px;
  color: yellow;
  text-align: center;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0;
  border-radius: 20px;
  border: none;
  background-color: yellow;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
