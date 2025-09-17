import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to={"/sign-in"} />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };
  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-col">
        <Header
          onWorkspaceSelected={() => {}}
          selectedWorkspace={null}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
