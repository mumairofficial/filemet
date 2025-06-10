// src/fileStructureParser.ts
export class FileStructureParser {
    parse(expression: string): string[] | string {
        try {
            const cleaned = expression.trim();
            if (!cleaned) {
                return "ERROR: Invalid expression syntax";
            }
            
            const result = this.parseExpression(cleaned);
            return result.filter(path => path.length > 0);
        } catch (error) {
            return "ERROR: Invalid expression syntax";
        }
    }

    private parseExpression(expr: string): string[] {
        const result: string[] = [];
        
        // Split by top-level + or , (not inside brackets)
        const parts = this.splitTopLevel(expr, ['+', ',']);
        
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed) {
                result.push(...this.parsePart(trimmed));
            }
        }
        
        return result;
    }

    private parsePart(part: string): string[] {
        // Check if this part has grouping brackets
        const groupMatch = part.match(/^([^[\({]*)([\[{(])(.+)([\]})])$/);
        
        if (groupMatch) {
            const basePath = groupMatch[1].trim();
            const openBracket = groupMatch[2];
            const groupContent = groupMatch[3];
            const closeBracket = groupMatch[4];
            
            // Validate matching brackets
            if (!this.isMatchingBracket(openBracket, closeBracket)) {
                throw new Error('Mismatched brackets');
            }
            
            // Parse group content
            const groupPaths = this.parseExpression(groupContent);
            
            if (basePath) {
                return groupPaths.map(p => `${basePath}/${p}`);
            } else {
                return groupPaths;
            }
        } else {
            // Simple path without grouping
            return [part.trim()];
        }
    }

    private splitTopLevel(expr: string, separators: string[]): string[] {
        const parts: string[] = [];
        let current = '';
        let bracketDepth = 0;
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (['[', '{', '('].includes(char)) {
                bracketDepth++;
                current += char;
            } else if ([']', '}', ')'].includes(char)) {
                bracketDepth--;
                current += char;
                
                // Check for negative bracket depth (unopened closing bracket)
                if (bracketDepth < 0) {
                    throw new Error('Unopened closing bracket');
                }
            } else if (separators.includes(char) && bracketDepth === 0) {
                parts.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            parts.push(current);
        }
        
        if (bracketDepth !== 0) {
            throw new Error('Unmatched brackets');
        }
        
        return parts;
    }

    private isMatchingBracket(open: string, close: string): boolean {
        const pairs: Record<string, string> = {
            '[': ']',
            '{': '}',
            '(': ')'
        };
        return pairs[open] === close;
    }
}
