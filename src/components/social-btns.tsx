import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function SocialBtns() {
  const navigate = useNavigate();
  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    try {
      if (id === "google") {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleProvider);
      } else if (id === "github") {
        const githubProvider = new GithubAuthProvider();
        await signInWithPopup(auth, githubProvider);
      }
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        e.code === "auth/account-exists-with-different-credential"
          ? alert("이미 가입된 이메일입니다. 이메일/비밀번호로 로그인해주세요.")
          : alert(e.code);
      }
    }
  };

  return (
    <Buttons>
      <Button onClick={onClick} id="google">
        <Logo src="/google-logo.svg" />
        Continue with Google
      </Button>
      <Button onClick={onClick} id="github">
        <Logo src="/github-logo.svg" />
        Continue with Github
      </Button>
    </Buttons>
  );
}

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 20px;
  border: 0;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &#google {
    background-color: #fff;
    color: #000;
  }
  &#github {
    background-color: #444;
    color: #fff;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const Logo = styled.img`
  height: 25px;
`;
