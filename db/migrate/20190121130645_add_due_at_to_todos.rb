class AddDueAtToTodos < ActiveRecord::Migration[5.2]
  def change
    add_column :todos, :due_at, :date
  end
end
