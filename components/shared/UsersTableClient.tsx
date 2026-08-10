"use client";

import { CenteredSpinner } from "@/components/shared/CenteredSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers, suspendUser } from "@/services/auth";
import { CurrentUser } from "@/types/user.types";
import Cookies from "js-cookie";
import { UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const SUSPENDED_STATUS = "SUSPENDED";
const ACTIVE_STATUS = "ACTIVE";
const PAGE_SIZE = 7;

function getStatusBadgeClass(status: string) {
  if (status === SUSPENDED_STATUS) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
  }
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
}

function getActionButton(user: CurrentUser, onSuspend: (user: CurrentUser) => void) {
  if (user.status === ACTIVE_STATUS) {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onSuspend(user)}
        className="gap-1"
      >
        <UserX className="h-4 w-4" />
        Suspend
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" disabled className="gap-1">
      <UserCheck className="h-4 w-4" />
      Activate
    </Button>
  );
}

export default function UsersTableClient() {
  const router = useRouter();
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const result = await getAllUsers(token);
      setUsers(result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      showToast(message);
      if (message === "Unauthorized") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSuspend = async (user: CurrentUser) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      showToast("Authentication required");
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to suspend ${user.name}?`,
    );
    if (!confirmed) return;

    setUpdatingId(user.id);
    try {
      await suspendUser(token, user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: SUSPENDED_STATUS } : u,
        ),
      );
      showToast(`${user.name} has been suspended.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to suspend user";
      showToast(message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const goToPrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentPage((prev) =>
      prev < totalPages ? prev + 1 : prev,
    );
  };

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-md border border-destructive bg-destructive px-4 py-3 text-sm text-white shadow-md">
          {toast}
        </div>
      )}

      <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">
              {users.length} total user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <CenteredSpinner />
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <p className="text-muted-foreground">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role.toLowerCase()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {getActionButton(user, handleSuspend)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrev}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
