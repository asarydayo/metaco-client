import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import _ from "underscore";
import {
  List,
  Container,
  Header,
  Icon,
  Form,
  Grid,
  Image,
  Table,
} from "semantic-ui-react";
import http from "../../util/http";

export default function index({ leaderboard_data, leaderboard_query }) {
  const router = useRouter();
  const [queryPage, setQueryPage] = useState(leaderboard_query);

  function updateQueryPage(e) {
    const input = e.target;
    setQueryPage({ ...queryPage, [input.name]: input.value });
  }

  function updateQueryPageSelect(e, data) {
    setQueryPage({ ...queryPage, category: data.value });
  }

  useEffect(() => {
    setQueryPage(leaderboard_query);
  }, [leaderboard_query]);

  function startSearch(e) {
    e.preventDefault();
    router.push(
      `/leaderboard?page=${queryPage.page}&per_page=${
        queryPage.per_page
      }&search=${queryPage.search || ""}`
    );
  }

  return (
    <>
      <Head>
        <title>Recipe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header>Leaderboard</Header>
        <Form onSubmit={(e) => startSearch(e)}>
          <Form.Group>
            <Form.Input
              name="search"
              type="text"
              placeholder="Name"
              onChange={updateQueryPage}
              defaultValue={queryPage.search}
            />
            <Form.Button type="submit">Search</Form.Button>
          </Form.Group>
        </Form>

        <Table basic="very" celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell>Point</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {leaderboard_data.length ? (
              leaderboard_data.map((item, key) => (
                <Table.Row key={key}>
                  <Table.Cell>
                    <Header as="h4" image>
                      <Image
                        src={item.logo || "/pizza.png"}
                        rounded
                        size="mini"
                      />
                      <Header.Content>
                        <Link href={`/leaderboard/${item.id}`}>
                          {item.name}
                        </Link>
                        <Header.Subheader>{item.captain.name}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{item.point}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <p>Leaderboard empty</p>
            )}
            <pre>{JSON.stringify(leaderboard_query, null, 2)}</pre>
          </Table.Body>
        </Table>
        <Grid columns={3}>
          <Grid.Column textAlign="left">
            <Link
              href={`/leaderboard?paginated=true&page=${
                leaderboard_query.page - 1
              }&per_page=${leaderboard_query.per_page}&search=${
                leaderboard_query.search || ""
              }`}
            >
              <a>
                <Icon size="big" name="arrow left" />
              </a>
            </Link>
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            Page {leaderboard_query.page}
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Link
              href={`/leaderboard?paginated=true&page=${
                leaderboard_query.page + 1
              }&per_page=${leaderboard_query.per_page}&search=${
                leaderboard_query.search || ""
              }`}
            >
              <a>
                <Icon size="big" name="arrow right" />
              </a>
            </Link>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const { page, per_page, search } = context.query;
  const query = `/team?paginated=true&page=${page}&per_page=${per_page}&search=${
    search || ""
  }`;
  const res = await http.get(`${query}`);

  return {
    props: {
      leaderboard_data: res ? res.data.data.data : null,
      leaderboard_query: res.data.data.meta,
    },
  };
}
