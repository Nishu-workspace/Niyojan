import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetWorkspaceDetailsQuery,
  useRemoveWorkspaceMemberMutation,
} from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import type { Workspace, WorkspaceMemberRole } from "@/types";
import { Loader2, MoreVertical } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const removeMemberMutation = useRemoveWorkspaceMemberMutation();

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  const workspaceMembers = data?.members ?? [];

  const privilegedMembers = useMemo(
    () =>
      workspaceMembers.filter((member) =>
        ["owner", "admin"].includes(member.role)
      ),
    [workspaceMembers]
  );

  const currentUserRole: WorkspaceMemberRole | null = useMemo(() => {
    if (!user) return null;

    const membership = workspaceMembers.find(
      (member) => member.user._id === user._id
    );

    return membership?.role ?? null;
  }, [user, workspaceMembers]);

  const canManageMembers = !!currentUserRole
    ? ["owner", "admin"].includes(currentUserRole)
    : false;

  const filteredMembers = useMemo(
    () =>
      workspaceMembers.filter(
        (member) =>
          member.user.name.toLowerCase().includes(search.toLowerCase()) ||
          member.user.email.toLowerCase().includes(search.toLowerCase()) ||
          member.role?.toLowerCase().includes(search.toLowerCase())
      ),
    [workspaceMembers, search]
  );

  const canRemoveMember = (member: Workspace["members"][number]) => {
    const isMemberRole = ["member", "viewer"].includes(member.role);
    const isSelf = user?._id === member.user._id;
    const hasAnotherPrivileged = privilegedMembers.some(
      (privileged) => privileged.user._id !== member.user._id
    );

    if (!isMemberRole) return false;

    if (isSelf) {
      return hasAnotherPrivileged;
    }

    return canManageMembers;
  };

  const handleRemoveMember = async (member: Workspace["members"][number]) => {
    if (!workspaceId) return;

    if (!canRemoveMember(member)) {
      toast.error("You are not authorized to remove this member.");
      return;
    }

    const confirmed = window.confirm(
      `Removing ${member.user.name} will revoke their access to all workspace projects and tasks. Do you want to continue?`
    );

    if (!confirmed) return;

    try {
      setRemovingMemberId(member._id);
      await removeMemberMutation.mutateAsync({
        workspaceId,
        memberId: member._id,
      });
      toast.success(`${member.user.name} has been removed from the workspace.`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to remove member.";
      toast.error(message);
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!data || !workspaceId) return <div>No workspace found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
      </div>

      <Input
        placeholder="Search members ...."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {filteredMembers.length} members in your workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {filteredMembers.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="bg-gray-500">
                        <AvatarImage src={member.user.profilePicture} />
                        <AvatarFallback>
                          {member.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-11 md:ml-0">
                      <Badge
                        variant={
                          ["admin", "owner"].includes(member.role)
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>

                      <Badge variant={"outline"}>{data.name}</Badge>

                      {canRemoveMember(member) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={
                                removeMemberMutation.isPending &&
                                removingMemberId === member._id
                              }
                            >
                              {removeMemberMutation.isPending &&
                              removingMemberId === member._id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <MoreVertical className="size-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleRemoveMember(member)}
                            >
                              Remove from workspace
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.user._id}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="bg-gray-500 size-20 mb-4">
                    <AvatarImage src={member.user.profilePicture} />
                    <AvatarFallback className="uppercase">
                      {member.user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-lg font-medium mb-2">
                    {member.user.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4">
                    {member.user.email}
                  </p>

                  <Badge
                    variant={
                      ["admin", "owner"].includes(member.role)
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>

                  {canRemoveMember(member) && (
                    <Button
                      variant="ghost"
                      className="mt-4"
                      onClick={() => handleRemoveMember(member)}
                      disabled={
                        removeMemberMutation.isPending &&
                        removingMemberId === member._id
                      }
                    >
                      {removeMemberMutation.isPending &&
                      removingMemberId === member._id ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : null}
                      Remove from workspace
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Members;
