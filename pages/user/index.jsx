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

export default function index({ user_data, user_query }) {
  const router = useRouter();
  const [queryPage, setQueryPage] = useState(user_query);

  function updateQueryPage(e) {
    const input = e.target;
    setQueryPage({ ...queryPage, [input.name]: input.value });
  }

  function updateQueryPageSelect(e, data) {
    setQueryPage({ ...queryPage, category: data.value });
  }

  useEffect(() => {
    setQueryPage(user_query);
  }, [user_query]);

  function startSearch(e) {
    e.preventDefault();
    router.push(
      `/user?page=${queryPage.page}&per_page=${queryPage.per_page}&search=${
        queryPage.search || ""
      }`
    );
  }

  return (
    <>
      <Head>
        <title>Players</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header>Players</Header>
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
            {user_data.length ? (
              user_data.map((item, key) => (
                <Table.Row key={key}>
                  <Table.Cell>
                    <Header as="h4" image>
                      <Image
                        src={item.logo || "/pizza.png"}
                        rounded
                        size="mini"
                      />
                      <Header.Content>
                        <Link href={`/user/${item.id}`}>{item.name}</Link>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{item.coin}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <p>Leaderboard empty</p>
            )}
          </Table.Body>
        </Table>
        <Grid columns={3}>
          <Grid.Column textAlign="left">
            <Link
              href={`/user?paginated=true&page=${
                user_query.page - 1
              }&per_page=${user_query.per_page}&search=${
                user_query.search || ""
              }`}
            >
              <a>
                <Icon size="big" name="arrow left" />
              </a>
            </Link>
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            Page {user_query.page}
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Link
              href={`/user?paginated=true&page=${
                user_query.page + 1
              }&per_page=${user_query.per_page}&search=${
                user_query.search || ""
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
  const query = `/user?paginated=true&page=${page}&per_page=${per_page}&search=${
    search || ""
  }`;
  const res = await http.get(`${query}`);

  return {
    props: {
      user_data: res ? res.data.data.data : null,
      user_query: res.data.data.meta,
    },
  };
}
