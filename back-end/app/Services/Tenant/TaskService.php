<?php

namespace App\Services\Tenant;

use App\DTO\Tenant\TaskDTO;
use App\Exceptions\GeneralException;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Tenant\Task;
use App\Services\BaseService;
use DB;

class TaskService extends BaseService
{
    public function __construct(
        public Task $model,
    ) {}

    public function getModel(): Task
    {
        return $this->model;
    }

    public function getAll(array $filters = [])
    {
        return $this->queryGet($filters)->get();
    }

    public function queryGet(array $filters = [], array $withRelations = []): Builder
    {
        $data = $this->model->with($withRelations)->ordered();
        return $data;
    }

    public function store(TaskDTO $taskDTO): Task
    {
        try {
            DB::beginTransaction();
            
            // Create the task
            $data = $this->model->create($taskDTO->toArray());
            
            // Save followers if provided
            if (!empty($taskDTO->followers)) {
                $this->syncFollowers($data, $taskDTO->followers);
            }
            
            DB::commit();
            return $data;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to create task: ' . $e->getMessage());
        }
    }

    /**
     * Sync followers for a task
     */
    public function syncFollowers(Task $task, array $followerIds): void
    {
        $task->followers()->sync($followerIds);
    }

    /**
     * Add a follower to a task
     */
    public function addFollower(Task $task, int $followerId): void
    {
        $task->followers()->syncWithoutDetaching([$followerId]);
    }

    /**
     * Remove a follower from a task
     */
    public function removeFollower(Task $task, int $followerId): void
    {
        $task->followers()->detach($followerId);
    }

    /**
     * Get task with followers
     */
    public function getWithFollowers(int $taskId): Task
    {
        return $this->model->with('followers')->findOrFail($taskId);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): bool
    {
        try {
            DB::beginTransaction();
            
            $task = $this->findById($id);
            
            // Detach followers before deleting
            $task->followers()->detach();
            
            // Delete any associated reminders
            $task->reminders()->delete();
            
            $result = $task->delete();
            
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to delete task: ' . $e->getMessage());
        }
    }

 
}