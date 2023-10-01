import { API } from "aws-amplify";
import * as queries from "../graphql/queries";
import { GraphQLQuery } from "@aws-amplify/api";
import { ListPostsQuery, GetPostQuery, Post } from "../API";
import { useState, useEffect } from "react";
import { useUser } from "../context/AuthContext";
import { Container, Grid } from "@mui/material";
import PostPreview from "../components/PostPreview";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: queries.listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };

      if (allPosts.data) {
        setPosts(allPosts.data.listPosts?.items as Post[]);
        return allPosts.data.listPosts?.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromApi();
  }, []);

  return (
    <Grid
      container
      style={{ marginTop: 16, padding: 24 }}
      spacing={{ xs: 1, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      direction="column"
      alignContent="center"
      justifyContent="center"
    >
      {posts.map((post) => (
        <div className="m-6 p-6 max-w-fit" key={post.id}>
          <PostPreview key={post.id} post={post} />
        </div>
      ))}
    </Grid>
  );
}
