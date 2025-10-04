import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { NoDataFound } from "@/components/workspace/no-data-found";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { Loader, PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { format } from "date-fns";
const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl m:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title="No Workspaces found"
              description="Create a new workspace to get started"
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-md hover:shadow-ms hover:-trasnlate-y-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground ">
                  Created at {format(workspace.createdAt, "d MMM, yyyy h:mm a")}
                </span>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs">{workspace.members.length}</span>
            </div>
          </div>
          <CardDescription>
            {workspace.description || "No Description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            View Workspace Details and projects
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default Workspaces;
