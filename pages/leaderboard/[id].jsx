import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Icon, Container, Button, Card, Image } from "semantic-ui-react";
import http from "../../util/http";

export default function index({ leaderboard_data }) {
  return (
    <>
      <Head>
        <title>{leaderboard_data.name} Team</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Card.Group centered>
          <Card>
            <Image
              src={leaderboard_data.logo || "/pizza.png"}
              wrapped
              ui={false}
            />
            <Card.Content>
              <Card.Header>{leaderboard_data.name}</Card.Header>
              <Card.Description>
                {leaderboard_data.point} point(s)
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="user" />
                10 Friends
              </a>
            </Card.Content>
          </Card>
        </Card.Group>
        <h1>Members</h1>
        {leaderboard_data.members ? (
          <Card.Group>
            {leaderboard_data.members.map((item) => {
              return (
                <Card fluid>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src={item.user.picture || "/pizza.png"}
                    />
                    <Card.Header>
                      <Link href={`/user/${item.user.id}`}>
                        {item.ingame_id}
                      </Link>
                    </Card.Header>
                    <Card.Meta>{item.user.name}</Card.Meta>
                    <Card.Meta>{item.user.coin} Coin(s)</Card.Meta>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        ) : (
          "?"
        )}
        <h1>Tournament</h1>
        {leaderboard_data.results ? (
          <Card.Group>
            {leaderboard_data.results.map((item) => {
              return (
                <Card fluid>
                  <Card.Content>
                    <Card.Header>
                      <small>{placementText(item.position)}</small>
                    </Card.Header>
                    <Card.Header>{item.tournament.title}</Card.Header>
                    <Card.Meta>{item.point} Point(s)</Card.Meta>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        ) : (
          "?"
        )}
      </Container>
    </>
  );
}

function placementText(value) {
  switch (value) {
    case 1:
      return "First place / #1st";
      break;
    case 2:
      return "Second place / #2nd";
      break;
    case 3:
      return "Third place / #3rd";
      break;

    default:
      break;
  }
}
export async function getServerSideProps(context) {
  const { id } = context.params;
  const query = `/team/${id}?with_data=true`;
  const res = await http.get(`${query}`);

  return {
    props: {
      leaderboard_data: res ? res.data.data : null,
    },
  };
}
