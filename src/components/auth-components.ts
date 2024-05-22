import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  height: 100%;
  padding: 50px 0;
`;

export const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 50px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  font-weight: 600;

  &[type="submit"] {
    background-color: yellow;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  margin-top: 10px;
  font-weight: 600;
  color: tomato;
`;

export const Or = styled.p`
  position: relative;
  width: 90%;
  margin: 1.5rem auto;
  font-size: 1rem;
  color: gray;
  text-align: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: calc(50% - 2rem);
    height: 1px;
    background-color: #ccc;
  }

  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

export const Switcher = styled.span`
  margin-bottom: 10px;

  a {
    color: #1d9bf0;
    text-decoration: none;
  }
`;
