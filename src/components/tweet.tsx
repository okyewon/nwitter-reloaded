import styled from "styled-components";
import { ITweet } from "./timeline";
import { FaRegTrashCan, FaUser } from "react-icons/fa6";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { RiEditLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function Tweet({ userId, username, photo, tweet, id }: ITweet) {
  const user = auth.currentUser;
  const dbTextRef = useRef(null);
  const editTextRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(tweet);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const getAvatarImg = async () => {
      const locationRef = ref(storage, `avatars/${userId}`);
      console.log(locationRef);
      const avatarURL = await getDownloadURL(locationRef);
      setAvatar(avatarURL);
    };
    getAvatarImg();
  }, [userId]);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;

    setEditMode(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: text,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column className="texts">
        <UserInfo>
          {!avatar ? (
            <Icon>
              <FaUser />
            </Icon>
          ) : (
            <User src={avatar}></User>
          )}
          <Username>{username}</Username>
        </UserInfo>
        {editMode ? (
          <EditText
            ref={editTextRef}
            id="edit-tweet"
            required
            rows={3}
            maxLength={350}
            onChange={onChange}
            value={text}
          ></EditText>
        ) : (
          <Payload ref={dbTextRef} id="tweet">
            {tweet}
          </Payload>
        )}
        {user?.uid === userId ? (
          <UserButtons>
            {editMode ? (
              <UserButton className="save" onClick={saveEdit} type="button">
                <FaCheck />
              </UserButton>
            ) : (
              <UserButton className="edit" onClick={onEdit} type="button">
                <RiEditLine />
              </UserButton>
            )}
            <UserButton className="delete" onClick={onDelete} type="button">
              <FaRegTrashCan />
            </UserButton>
          </UserButtons>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Column = styled.div`
  &.texts {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #fff;
`;

const User = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const Payload = styled.p`
  flex: 1;
  width: 100%;
  margin: 0;
  display: -webkit-inline-box;
  font-size: 1rem;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EditText = styled.textarea`
  width: 100%;
  padding: 20px;
  border: 1px solid yellow;
  border-radius: 10px;
  background-color: #000;
  font-size: 1rem;
  color: white;
  resize: none;
  &:focus {
    outline: none;
  }
`;

const UserButtons = styled.div`
  display: flex;
  gap: 5px;
`;

const UserButton = styled.button`
  padding: 5px 10px;
  border: 0;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;

  &.save {
    background-color: yellow;
  }

  &.edit {
    background-color: #77ff00;
  }

  &.delete {
    background-color: orangered;
    color: #fff;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
`;
