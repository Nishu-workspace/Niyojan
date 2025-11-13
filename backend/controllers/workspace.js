import { recordActivity } from "../libs/index.js";
import { sendEmail } from "../libs/send-email.js";
import Project from "../models/projects.js";
import Task from "../models/task.js";
import User from "../models/User.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import Workspace from "../models/workspace.js";
import jwt from "jsonwebtoken";
const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaces = async (req, res) => {
  console.log(req.user);
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById({
      _id: workspaceId,
      // "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    return res.status(200).json(workspace);
  } catch (error) {}
};
const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    console.log("workspace id", workspaceId);
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    console.log(workspace);
    if (!workspace) {
      return res.stauts(404).json({
        message: "Workspace not found",
      });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // "members.users": req.user._id,
      // members: { $in: [req.user._id] },
    })
      // .populate("tasks", "status")
      .sort({ createdAt: -1 });
    console.log(projects);
    return res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchived priority"
        )
        .sort({ createdAt: -1 }),
    ]);

    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);

    const totalProjectInProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;
    // const totalProjectCompleted = projects.filter(
    //   (project) => project.status === "Completed"
    // ).length;

    const totalTaskCompleted = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "Done").length
      );
    }, 0);

    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);
    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks);

    // get upcoming task in next 7 days

    const upcomingTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    const taskTrendsData = [
      { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
    ];

    // get last 7 days tasks date
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // populate

    for (const project of projects) {
      for (const task in project.tasks) {
        const taskDate = new Date(task.updatedAt);

        const dayInDate = last7Days.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear()
        );

        if (dayInDate !== -1) {
          const dayName = last7Days[dayInDate].toLocaleDateString("en-US", {
            weekday: "short",
          });

          const dayData = taskTrendsData.find((day) => day.name === dayName);

          if (dayData) {
            switch (task.status) {
              case "Done":
                dayData.completed++;
                break;
              case "In Progress":
                dayData.inProgress++;
                break;
              case "To Do":
                dayData.toDo++;
                break;
            }
          }
        }
      }
    }
    // get project status distribution
    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;
        case "In Progress":
          projectStatusData[1].value++;
          break;
        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }

    // Task priority distribution
    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const task of tasks) {
      switch (task.priority) {
        case "High":
          taskPriorityData[0].value++;
          break;
        case "Medium":
          taskPriorityData[1].value++;
          break;
        case "Low":
          taskPriorityData[2].value++;
          break;
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTask = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );

      const completedTask = projectTask.filter(
        (task) => task.status === "Done" && task.isArchived === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTask.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: "You are not authorized to invite members to this workspace",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === existingUser._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    console.log(workspaceId);
    const isInvited = await WorkspaceInvite.findOne({
      user: existingUser._id,
      workspaceId: workspaceId,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res.status(400).json({
        message: "User already invited",
      });
    }

    if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.deleteOne({ _id: isInvited._id });
    }

    const inviteToken = jwt.sign(
      {
        user: existingUser._id,
        workspaceId: workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await WorkspaceInvite.create({
      user: existingUser._id,
      workspaceId: workspaceId,
      token: inviteToken,
      role: role || "member",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

    const emailContent = `
      <p>You have been invited to join ${workspace.name} workspace</p>
      <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
    `;

    await sendEmail(
      email,
      "You have been invited to join a workspace",
      emailContent
    );

    res.status(200).json({
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    console.log(req.user);
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "You are already a member of this workspace",
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });
    workspace.save();

    await recordActivity(
      req.user._id,
      "joined_workspace",
      "Workspace",
      workspaceId,
      {
        description: `Joined ${workspace.name} workspace`,
      }
    );

    return res.status(200).json({
      message: "Invitation accepted succesfully",
    });
  } catch (error) {}
};

const acceptInviteByToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded info", decoded);
    const { user, workspaceId, role } = decoded;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }
    const inviteInfo = await WorkspaceInvite.findOne({
      user: user,
      workspaceId: workspaceId,
    });
    if (!inviteInfo) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invitation has expired",
      });
    }

    workspace.members.push({
      user: user,
      role: role || "member",
      joinedAt: new Date(),
    });
    await workspace.save();

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
        description: `Joined ${workspace.name} workspace`,
      }),
    ]);

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {}
};

const removeWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const requesterId = req.user._id.toString();

    const getMemberUserId = (member) => {
      if (!member?.user) return null;
      if (member.user._id) return member.user._id.toString();
      if (member.user.id) return member.user.id.toString();
      return member.user.toString();
    };

    const requesterMembership = workspace.members.find(
      (member) => getMemberUserId(member) === requesterId
    );

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const targetMember =
      workspace.members.id(memberId) ||
      workspace.members.find((member) => getMemberUserId(member) === memberId);

    if (!targetMember) {
      return res.status(404).json({
        message: "Member not found in this workspace",
      });
    }

    const targetUserId = getMemberUserId(targetMember);
    const isSelfRemoval = requesterId === targetUserId;

    if (!["member", "viewer"].includes(targetMember.role)) {
      return res.status(403).json({
        message: "You can only remove members with role member or viewer",
      });
    }

    const privilegedMembers = workspace.members.filter((member) =>
      ["owner", "admin"].includes(member.role)
    );

    const hasAnotherPrivilegedMember = privilegedMembers.some(
      (member) => getMemberUserId(member) !== targetUserId
    );

    if (isSelfRemoval) {
      if (!hasAnotherPrivilegedMember) {
        return res.status(400).json({
          message:
            "You cannot leave the workspace because there is no other admin or owner remaining",
        });
      }
    } else {
      if (!["owner", "admin"].includes(requesterMembership.role)) {
        return res.status(403).json({
          message: "Only workspace owner or admins can remove members",
        });
      }
    }

    const shouldRestrictRemoval =
      !isSelfRemoval &&
      (targetMember.role === "owner" || targetMember.role === "admin");

    if (shouldRestrictRemoval) {
      return res.status(403).json({
        message: "You cannot remove workspace owners or admins",
      });
    }

    const removedUser = await User.findById(targetUserId).select("email name");

    const targetUserName =
      targetMember.user?.name || removedUser?.name || "Member";

    workspace.members.pull({ _id: targetMember._id });
    await workspace.save();

    const projectIds = await Project.find({ workspace: workspaceId }).distinct(
      "_id"
    );

    await Promise.all([
      Project.updateMany(
        { workspace: workspaceId },
        { $pull: { members: { user: targetUserId } } }
      ),
      Task.updateMany(
        { project: { $in: projectIds } },
        {
          $pull: {
            assignees: targetUserId,
            watchers: targetUserId,
          },
        }
      ),
      recordActivity(
        req.user._id,
        "removed_member",
        "Workspace",
        workspaceId,
        {
          description: `Removed ${targetUserName} from ${workspace.name}`,
          removedUser: targetUserId,
          removedRole: targetMember.role,
        }
      ),
    ]);

    if (removedUser?.email) {
      const emailContent = `
        <p>Hi ${removedUser?.name || "there"},</p>
        <p>You have been removed from the workspace <strong>${workspace.name}</strong>.</p>
        <p>Your access to associated projects and tasks has been revoked. If you believe this was a mistake, please contact the workspace owner.</p>
      `;

      sendEmail(
        removedUser.email,
        `Removed from ${workspace.name} workspace`,
        emailContent
      ).catch((err) => console.log(err));
    }

    const updatedWorkspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );

    return res.status(200).json({
      message: "Member removed successfully",
      members: updatedWorkspace?.members || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptGenerateInvite,
  acceptInviteByToken,
  removeWorkspaceMember,
};
