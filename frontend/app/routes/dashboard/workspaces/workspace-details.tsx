import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState();
  const [isInviteMember, setIsInviteMember] = useState(false);
  if (!workspaceId) {
    return <div>No workspace found</div>;
  }
  return <div></div>;
};
export default WorkspaceDetails;
