import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Icon, Container, Button, Card, Image } from "semantic-ui-react";
import http from "../../util/http";

export default function index({ user_data }) {
  return (
    <>
      <Head>
        <title>{user_data.name} Team</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Card.Group centered>
          <Card>
            <Image src={user_data.picture || "/pizza.png"} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{user_data.name}</Card.Header>
              <Card.Description>{user_data.coin} coin(s)</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="user" />
                10 Friends
              </a>
            </Card.Content>
          </Card>
        </Card.Group>
        <h1>Teams</h1>
        {user_data.membership ? (
          <Card.Group>
            {user_data.membership.map((item) => {
              return (
                <Card fluid>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src={item.team.logo || "/pizza.png"}
                    />
                    <Card.Header>
                      <Link href={`/leaderboard/${item.team.id}`}>
                        {item.team.name}
                      </Link>
                    </Card.Header>
                    <Card.Meta>{item.ingame_id}</Card.Meta>
                  </Card.Content>
                  <Card.Content>
                    <Card.Group>
                      {item.team.results.map((item_res) => {
                        return (
                          <Card fluid>
                            <Card.Content>
                              <Card.Header>
                                <small>
                                  {placementText(item_res.position)}
                                </small>
                              </Card.Header>
                              <Card.Header>
                                {item_res.tournament.title}
                              </Card.Header>
                              <Card.Meta>{item_res.point} Point(s)</Card.Meta>
                            </Card.Content>
                          </Card>
                        );
                      })}
                    </Card.Group>
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
  const query = `/user/${id}?with_data=true`;
  const res = await http.get(`${query}`);

  return {
    props: {
      user_data: res ? res.data.data : null,
    },
  };
}
