import os
import gradio as gr
from modules import scripts, script_callbacks

# 安全路径配置
ALLOWED_PATHS = [
    "models", 
    "outputs",
    "extensions",
    "log/images"
]

class FileBrowser(scripts.Script):
    def title(self):
        return "📁 SD File Browser"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, _):
        with gr.Accordion("File Browser", open=False) as component:
            gr.HTML("<div id='file-browser-container'></div>")
        
        return [component]

def get_file_list(path):
    """安全获取目录文件列表"""
    if not any(allowed in path for allowed in ALLOWED_PATHS):
        return []
    
    try:
        entries = os.listdir(path)
        files = []
        dirs = []
        for entry in entries:
            full_path = os.path.join(path, entry)
            if os.path.isfile(full_path):
                files.append({
                    "name": entry,
                    "size": os.path.getsize(full_path),
                    "type": "file"
                })
            elif os.path.isdir(full_path):
                dirs.append({
                    "name": entry,
                    "type": "dir"
                })
        return sorted(dirs, key=lambda x: x["name"]) + sorted(files, key=lambda x: x["name"])
    except Exception as e:
        print(f"[FileBrowser] Error: {str(e)}")
        return []

script_callbacks.on_app_started(lambda _: gr.routes.append(("/file-browser/api", get_file_list)))
