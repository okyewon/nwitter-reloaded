import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Button = styled.span`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
  padding: 10px 20px;
  border: 0;
  border-radius: 50px;
  background-color: white;
  font-weight: 500;
  color: #000;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
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
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
