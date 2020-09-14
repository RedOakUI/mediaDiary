import { Button } from "@chakra-ui/core";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Log from "../components/Log";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import useUser from "../utils/useUser";
import Edit from "../components/Edit";
import LayoutModal from "../components/LayoutModal";
import React from "react";
import Day from "../components/Day";

function App() {
  const { user, logout } = useUser();
  const router = useRouter();
  return (
    <Layout>
      {!user ? (
        <Button onClick={() => router.push("/login")}>External Login</Button>
      ) : (
        <>
          <Header />
          <MediaDiary />
          {!!router.query.search && <Search />}
          {!!router.query.log && <Log />}
          {!!router.query.view && router.query.view === "edit" && <Log />}
          {!!router.query.day && (
            <LayoutModal>
              <Day item={router.query.day.toString()} />
            </LayoutModal>
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
