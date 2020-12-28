/**
 * Content
 * ---
 * This has all of the interactive between each "view"
 */

import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useMDDispatch, useMDState } from "../config/store";
import useIsBreakpoint from "../hooks/useIsBreakpoint";
import Day from "./Day";
import LayoutDrawer from "./layouts/LayoutDrawer";
import Log from "./Log";
import MdLogo from "./md/MdLogo";
import Search from "./Search";

function Content(): JSX.Element {
  const { view } = useMDState();
  const dispatch = useMDDispatch();
  const refInput = useRef<HTMLInputElement>(null);
  const isMD = useIsBreakpoint("md");
  return (
    <>
      <Modal
        isOpen={view === "search"}
        onClose={() => dispatch({ type: "dayClose" })}
        scrollBehavior="inside"
        size={isMD ? "xl" : "sm"}
        initialFocusRef={refInput}
      >
        <ModalOverlay sx={{ zIndex: 2 }}>
          <ModalContent maxHeight="50vh" my={{ base: 2, sm: "3.75rem" }}>
            <ModalCloseButton />
            <ModalHeader>
              <MdLogo title="Search" />
            </ModalHeader>
            <ModalBody pt={0} pb={6}>
              {view === "search" && <Search refInput={refInput} />}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <LayoutDrawer
        isOpen={view === "log" || view === "day" || view === "edit"}
        placement="right"
      >
        {view === "log" && <Log />}
        {(view === "day" || view === "edit") && <Day />}
      </LayoutDrawer>
    </>
  );
}

export default Content;