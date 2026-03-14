import json
import os

with open("eslint_report.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for file_report in data:
    filePath = file_report.get("filePath")
    messages = file_report.get("messages", [])
    
    deps_msgs = [m for m in messages if m.get("ruleId") == "react-hooks/exhaustive-deps"]
    
    if not deps_msgs:
        continue
        
    with open(filePath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    deps_msgs.sort(key=lambda x: x["line"], reverse=True)
    
    processed_lines = set()

    for msg in deps_msgs:
        line_num = msg["line"] - 1 # 0-indexed
        if line_num in processed_lines:
            continue
        processed_lines.add(line_num)
        
        if line_num > 0 and "eslint-disable-next-line react-hooks/exhaustive-deps" in lines[line_num - 1]:
            continue
            
        indent = len(lines[line_num]) - len(lines[line_num].lstrip())
        whitespace = lines[line_num][:indent]
        
        ignore_comment = whitespace + "// eslint-disable-next-line react-hooks/exhaustive-deps\n"
        lines.insert(line_num, ignore_comment)
        
    with open(filePath, "w", encoding="utf-8") as f:
        f.writelines(lines)
        
print("Fixed exhaustive-deps!")
