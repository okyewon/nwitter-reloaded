import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRegEdit, FaUserCircle } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [backImg, setBackImg] = useState("");
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState<string>(user?.displayName ?? "");

  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, id } = e.target;
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const target = id === "back" ? "backgrounds" : "avartar";
      const locationRef = ref(storage, `${target}/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const imgURL = await getDownloadURL(result.ref);

      if (id && id === "back") {
        setBackImg(imgURL);
      } else if (id === "avatar") {
        setAvatar(imgURL);
        await updateProfile(user, {
          photoURL: imgURL,
        });
      } else {
        return;
      }
    }
  };

  useEffect(() => {
    const getBackImg = async () => {
      const locationRef = ref(storage, `backgrounds/${user?.uid}`);
      const backImgURL = await getDownloadURL(locationRef);
      setBackImg(backImgURL);
    };
    getBackImg();

    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      if (!user) return;
      const tweetQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user.uid),
        orderBy("createAt", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
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
      });
    };

    if (user) {
      fetchTweets();
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user]);

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
      <Category>Profile</Category>
      <ProfileArea>
        <BackUpload htmlFor="back">
          {backImg ? <BackImg src={backImg} /> : ""}
          <BackInput
            onChange={onImgChange}
            id="back"
            type="file"
            accept="image/*"
          />
        </BackUpload>
        <AvatarWrap>
          <AvatarUpload htmlFor="avatar">
            {avatar ? <AvatarImg src={avatar} /> : <FaUserCircle />}
          </AvatarUpload>
          <AvatarInput
            onChange={onImgChange}
            id="avatar"
            type="file"
            accept="image/*"
          />
          <NameWrap>
            {editMode ? (
              <InputWrap className="name">
                <InputSize>{name}</InputSize>
                <NameInput type="text" value={name} onChange={onChange} />
                <NameSave type="button" onClick={onSave} className="btn">
                  <FaCheckCircle />
                </NameSave>
              </InputWrap>
            ) : (
              <Name className="name">
                {name ?? "Anonymous"}
                <NameEdit type="button" onClick={onEdit} className="btn">
                  <FaRegEdit />
                </NameEdit>
              </Name>
            )}
            <br />
            <Email>{user?.email}</Email>
          </NameWrap>
        </AvatarWrap>
      </ProfileArea>
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
`;

const Category = styled.h2`
  width: 100%;
  padding: 0 10px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
`;

const ProfileArea = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 150px;
`;

const BackUpload = styled.label`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: #333;
`;

const BackImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const BackInput = styled.input`
  display: none;
`;

const AvatarWrap = styled.div`
  position: absolute;
  top: calc(100% - 100px);
  left: 5%;
`;

const AvatarUpload = styled.label`
  overflow: hidden;
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #000;
  color: #ccc;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const AvatarImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: calc(100% + 20px);

  .name {
    position: relative;
  }

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

const Email = styled.span`
  font-size: 1rem;
  line-height: 2;
  color: #ccc;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 30px;
  padding-bottom: 100px;
`;
