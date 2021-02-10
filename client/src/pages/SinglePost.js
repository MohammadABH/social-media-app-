import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Grid,
  Image,
  Label,
  Icon,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";
import DarkPopup from "../util/DarkPopup";

function SinglePost(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { loading, data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePostCallback = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (loading) {
    postMarkup = <p>Loading Post...</p>;
  } else if (!getPost) {
    postMarkup = <p>Post Not Found!</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ id, likes, likeCount }} />
                  <DarkPopup content="Please comment below">
                    <Button as="div" labelPosition="right">
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  </DarkPopup>
                  {user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback} />
                  )}
                </Card.Content>
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <h3>Post a Comment</h3>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((el) => (
              <Card fluid key={el.id}>
                <Card.Content>
                  {user && user.username === el.username && (
                    <DeleteButton postId={id} commentId={el.id} />
                  )}
                  <Card.Header>{el.username}</Card.Header>
                  <Card.Meta>{moment(el.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{el.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
