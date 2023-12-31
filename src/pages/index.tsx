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
  // let allPosts: any = await API.graphql<GraphQLQuery<ListPostsQuery>>({
  //   query: queries.listPosts,
  // });

  // let posts = allPosts.data?.listPosts?.items;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async () => {
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
      {posts
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => (
          <div className="m-6 p-6 max-w-fit" key={post.id}>
            <PostPreview key={post.id} post={post} />
          </div>
        ))}
    </Grid>
  );
}
