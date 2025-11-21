import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyArchivedTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const ArchivedTasks = () => {
  const { data: archivedTasks, isLoading } = useGetMyArchivedTasksQuery() as {
    data: Task[];
    isLoading: boolean;
  };

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  if (isLoading) return <Loader />;

  const filteredTasks = (archivedTasks || []).filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.updatedAt || !b.updatedAt) return 0;
    return sortDirection === "asc"
      ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Archived Tasks</h1>

        <Button
          variant="outline"
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
        >
          {sortDirection === "asc" ? "Oldest First" : "Newest First"}
        </Button>
      </div>

      <Input
        placeholder="Search archived tasks..."
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
              <CardTitle>Archived Tasks</CardTitle>
              <CardDescription>
                {sortedTasks.length} archived tasks
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {sortedTasks.map((task) => (
                  <div key={task._id} className="p-4 hover:bg-muted/50">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                      <div className="flex gap-3">
                        {task.status === "Done" ? (
                          <CheckCircle className="size-4 text-green-500" />
                        ) : (
                          <Clock className="size-4 text-yellow-500" />
                        )}

                        <div>
                          <Link
                            to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                            className="font-medium hover:text-primary hover:underline flex items-center"
                          >
                            {task.title}
                            <ArrowUpRight className="size-4 ml-1" />
                          </Link>

                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">Archived</Badge>
                            <Badge variant="secondary">{task.priority}</Badge>
                            <Badge variant="outline">{task.status}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Project: {task.project.title}</div>
                        <div>Updated: {format(task.updatedAt, "PPP")}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {sortedTasks.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No archived tasks found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Archived
                  <Badge variant="outline" className="ml-2">
                    {sortedTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {sortedTasks.map((task) => (
                  <Card key={task._id} className="hover:shadow-md transition">
                    <Link
                      to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                      className="block p-3"
                    >
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description || "No description"}
                      </p>
                    </Link>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArchivedTasks;