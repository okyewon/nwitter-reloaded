import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FaUser } from "react-icons/fa6";
import { TbPhotoFilled } from "react-icons/tb";
import { BsSendFill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
  const userAvatar = user?.photoURL;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 2 * 1024 * 1024;
    if (files && files.length === 1) {
      const uploadFile = files[0];
      if (uploadFile && uploadFile.size > maxSize) {
        alert("파일은 2MB 이하로 올려주세요 !");
        return;
      }
      setFile(uploadFile);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isLoading || tweet === "" || tweet.length > 350) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      {!userAvatar ? <FaUser /> : <User src={userAvatar}></User>}
      <Form onSubmit={onSubmit}>
        <TextArea
          required
          rows={5}
          maxLength={350}
          onChange={onChange}
          value={tweet}
          placeholder="what is happening?"
        />
        <Buttons>
          <div>
            <AttachFileButton htmlFor="file" className="icon-btn">
              {file ? "✅" : <TbPhotoFilled />}
            </AttachFileButton>
            <AttachFileInput
              onChange={onFileChange}
              type="file"
              id="file"
              accept="image/*"
            />
          </div>
          <SubmitBtn className="icon-btn">
            {isLoading ? <RiLoaderFill /> : <BsSendFill />}
          </SubmitBtn>
        </Buttons>
      </Form>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const User = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Form = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  .icon-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-6px);
    }
  }
`;

const AttachFileButton = styled.label`
  border: 1px solid yellow;
  color: yellow;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.button`
  border: none;
  background-color: yellow;
  color: #000;
  transition: opacity 0.3s;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;
