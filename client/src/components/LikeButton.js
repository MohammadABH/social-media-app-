import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Icon, Label, Button } from "semantic-ui-react";

import DarkPopup from "../util/DarkPopup";

function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: id,
    },
  });

  useEffect(() => {
    if (user && likes.find((el) => el.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );
  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <DarkPopup content={liked ? "Unlike" : "Like"}>{likeButton}</DarkPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default LikeButton;

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
