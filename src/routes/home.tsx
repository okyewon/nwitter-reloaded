import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

export default function Home() {
  return (
    <Wrapper>
      <Category>Home</Category>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  overflow-y: scroll;
`;

const Category = styled.h2`
  width: 100%;
  margin-bottom: 20px;
  padding: 0 10px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
`;
