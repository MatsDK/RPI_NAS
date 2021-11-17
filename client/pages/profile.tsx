import React from "react";
import { ProfileView } from "src/components/ProfileView";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { NextFunctionComponentWithAuth } from "types/types";

interface ProfileProps {}

const Profile: NextFunctionComponentWithAuth<ProfileProps> = ({ me }) => {
  useMeState(me);

  return <ProfileView />;
};

export default withAuth(Profile);
