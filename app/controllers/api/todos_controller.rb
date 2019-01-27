class Api::TodosController < ApplicationController

    wrap_parameters false

    def index
      if params[:tag].present?
        todos = Todo.tagged_with(params[:tag])
      else
        todos = Todo.all
      end
      render json: todos
    end
  
    def create
      todo = Todo.create(todo_params)
      render json: todo
    end
  
    def destroy
      Todo.destroy(params[:id])
    end
  
    def update
      todo = Todo.find(params[:id])
      todo.update_attributes(todo_params)
      render json: todo
    end
  
    private
  
    def todo_params
      params.require(:todo).permit(:id, :completed, :description, :due_at, :tag_list => [])
    end
    

  end
  