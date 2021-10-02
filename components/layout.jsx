import React from "react";
import { Link } from "next/link";
import { useRouter } from "next/router";

import { Container, Header, Menu } from "semantic-ui-react";

export default function layout({ children, href }) {
  const router = useRouter();
  const paths = router.pathname.split("/");

  function handleItemClick(e, { name }) {
    return router.push(`/${name}`);
  }

  return (
    <Container>
      <Menu>
        <Menu.Item
          name="leaderboard"
          active={paths[0] === "leaderboard"}
          onClick={handleItemClick}
        >
          Leaderboard
        </Menu.Item>
        <Menu.Item
          name="user"
          active={paths[0] === "user"}
          onClick={handleItemClick}
        >
          User
        </Menu.Item>
      </Menu>
      {children}
    </Container>
  );
}
