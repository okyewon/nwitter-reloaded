import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaRegEdit, FaUserCircle } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState<string>(user?.displayName ?? "");

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      setAvatar(avatarURL);
      await updateProfile(user, {
        photoURL: avatarURL,
      });
    }
  };

  const fetchTweets = useCallback(async () => {
    if (!user) return;
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (user && isMounted) {
      fetchTweets();
    }
    return () => {
      isMounted = false;
    };
  }, [user, fetchTweets]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEdit = () => {
    setEditMode(true);
  };

  const onSave = () => {
    setEditMode(false);
    if (!user) return;
    updateProfile(user, {
      displayName: name,
    });
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <FaUserCircle />}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <NameWrap>
        {editMode ? (
          <>
            <InputWrap>
              <InputSize>{name}</InputSize>
              <NameInput type="text" value={name} onChange={onChange} />
            </InputWrap>
            <NameSave type="button" onClick={onSave} className="btn">
              <FaCheckCircle />
            </NameSave>
          </>
        ) : (
          <>
            <Name>{name ?? "Anonymous"}</Name>
            <NameEdit type="button" onClick={onEdit} className="btn">
              <FaRegEdit />
            </NameEdit>
          </>
        )}
      </NameWrap>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  overflow: hidden;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  font-size: 100px;
  color: yellow;
  cursor: pointer;
`;

const AvatarImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameWrap = styled.div`
  position: relative;

  .btn {
    position: absolute;
    top: 0%;
    right: -2rem;
    font-size: 1.2rem;
  }
`;

const Name = styled.span`
  font-size: 1.25rem;
`;

const InputWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const InputSize = styled.span`
  white-space: pre;
  height: 1rem;
  padding: 0 5px;
  font-size: 1.25rem;
  opacity: 0;
`;

const NameInput = styled.input`
  position: absolute;
  top: -3px;
  left: 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid #fff;
  background-color: transparent;
  font-size: 1.25rem;
  color: #fff;
  &:focus,
  &:active {
    outline: none;
  }
`;

const NameSave = styled.button`
  color: green;
`;

const NameEdit = styled.button`
  color: #fff;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 30px;
  padding-bottom: 100px;
`;
