import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

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
          <MenuItem>
            <svg
              fill="none"
              strokeWidth={0}
              stroke="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </MenuItem>
          <MenuText>Home</MenuText>
        </Link>
        <Link to="/profile" className="menu-li">
          <MenuItem>
            <svg
              fill="none"
              strokeWidth={0}
              stroke="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </MenuItem>
          <MenuText>Profile</MenuText>
        </Link>
        <LogOut className="menu-li">
          <MenuItem className="log-out" onClick={onLogOut}>
            <svg
              fill="none"
              strokeWidth={1.5}
              stroke="orangered"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </MenuItem>
          <MenuText>Log-Out</MenuText>
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

  .logo {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }

  .menu-li {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Logo = styled.img`
  width: 40px;
`;

const LogOut = styled.div``;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;

  svg {
    width: 30px;
    fill: white;
  }
  &.log-out {
    border-color: orangered;
    svg {
      fill: none;
    }
  }
`;

const MenuText = styled.p``;
