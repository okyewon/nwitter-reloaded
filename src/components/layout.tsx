import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { IoHome } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { BsBoxArrowInLeft } from "react-icons/bs";

export default function Layout() {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <Link to="/" className="logo">
          <Logo src="/Exclude.svg" alt="" />
        </Link>
        <Link to="/" className="menu-li">
          <IoHome />
          Home
        </Link>
        <Link to="/profile" className="menu-li">
          <FaUser />
          Profile
        </Link>
        <LogOut className="menu-li" id="log-out" onClick={onLogOut}>
          <BsBoxArrowInLeft />
          Log-Out
        </LogOut>
      </Menu>
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 3fr 1fr;
  width: 100%;
  max-width: 1440px;
  padding: 50px 30px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .menu-li {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s;

    &:hover {
      transform: translateX(12px);
    }
  }
  #log-out {
    svg {
      font-size: 1.6rem;
      color: orangered;
    }
  }
`;

const Logo = styled.img`
  width: 40px;
`;

const LogOut = styled.div``;
