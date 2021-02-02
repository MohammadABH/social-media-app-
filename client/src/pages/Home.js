import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import PostCard from '../components/PostCard';

function Home(props) {
  const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading</h1>
        ) : (
          posts &&
          posts.map((el) => (
            <Grid.Column key={el.id} style={{ marginBottom: 20 }}>
              <PostCard post={el} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default Home;
