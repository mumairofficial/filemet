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
        // Check for obvious mismatched brackets before trying to find grouping
        if (/[\[{(].*[\]})]$/.test(part)) {
            // Contains brackets, let's validate them
            const brackets = part.match(/([\[{(])|([}\])])/g);
            if (brackets) {
                const stack: string[] = [];
                const pairs: Record<string, string> = { '[': ']', '{': '}', '(': ')' };
                
                for (const bracket of brackets) {
                    if (['[', '{', '('].includes(bracket)) {
                        stack.push(bracket);
                    } else {
                        const expected = stack.pop();
                        if (!expected || pairs[expected] !== bracket) {
                            throw new Error('Mismatched brackets');
                        }
                    }
                }
            }
        }
        
        // Find the last properly matched bracket pair for grouping
        const groupMatch = this.findGroupingBrackets(part);
        
        if (groupMatch) {
            const { basePath, openBracket, groupContent, closeBracket } = groupMatch;
            
            // Validate matching brackets
            if (!this.isMatchingBracket(openBracket, closeBracket)) {
                throw new Error('Mismatched brackets');
            }
            
            // Determine if this should be treated as grouping or literal text
            // For parentheses: only treat as grouping if it has separators or is clearly meant for grouping
            // For square/curly brackets: always treat as grouping (more explicit grouping syntax)
            const isParentheses = openBracket === '(' && closeBracket === ')';
            const hasGroupingSeparators = /[+,]/.test(groupContent);
            const hasNestedPaths = /[\/]/.test(groupContent);
            const isEmptyGroup = groupContent.trim().length === 0;
            
            // For parentheses, be more restrictive - only treat as grouping if:
            // 1. It has separators (+ or ,) OR
            // 2. It's at the end of the path (no trailing path components) AND has content
            // For brackets/braces, treat as grouping unless it looks like a literal path
            const isAtEndOfPath = basePath && !basePath.includes('/') && groupContent.trim().length > 0;
            const shouldTreatAsGrouping = isParentheses 
                ? (hasGroupingSeparators || isAtEndOfPath)
                : true; // Square brackets and curly braces are always grouping
            
            if (shouldTreatAsGrouping || isEmptyGroup) {
                // Parse group content
                const groupPaths = this.parseExpression(groupContent);
                
                if (basePath) {
                    return groupPaths.map(p => {
                        // Clean up path concatenation to avoid double slashes
                        const cleanBase = basePath.trim().replace(/\/+$/, ''); // Remove whitespace and trailing slashes
                        const cleanPath = p.replace(/^\/+/, ''); // Remove leading slashes
                        return `${cleanBase}/${cleanPath}`;
                    });
                } else {
                    return groupPaths;
                }
            } else {
                // Treat as literal path - just normalize whitespace
                const normalized = part.trim().replace(/\s*\/\s*/g, '/');
                return [normalized];
            }
        } else {
            // Simple path without grouping - normalize whitespace around path separators
            const normalized = part.trim().replace(/\s*\/\s*/g, '/');
            return [normalized];
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
                // For + separator: special handling for filename prefixes vs separators
                // For , separator: always treat as separator (existing behavior)
                if (char === '+') {
                    const hasWhitespaceBefore = i > 0 && /\s/.test(expr[i - 1]);
                    const hasWhitespaceAfter = i < expr.length - 1 && /\s/.test(expr[i + 1]);
                    const isAtStartWithSpace = i === 0 && i < expr.length - 1 && /\s/.test(expr[i + 1]);
                    const isAtStartOfToken = current.trim().length === 0;
                    const isAfterPathSeparator = i > 0 && expr[i - 1] === '/';
                    
                    // Treat + as separator if:
                    // 1. It has whitespace around it, OR
                    // 2. It's at start with space, OR  
                    // 3. It's NOT at the start of a token AND NOT immediately after a path separator
                    //    (e.g., file.ts+another.ts should split, but folder/+component.tsx should not)
                    const isSeparator = hasWhitespaceBefore || hasWhitespaceAfter || isAtStartWithSpace || 
                                       (!isAtStartOfToken && !isAfterPathSeparator);
                    
                    if (isSeparator) {
                        // This is a separator
                        parts.push(current);
                        current = '';
                    } else {
                        // This is part of a filename (+file.ts or folder/+component.tsx)
                        current += char;
                    }
                } else {
                    // For comma and other separators, always treat as separator
                    parts.push(current);
                    current = '';
                }
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

    private findGroupingBrackets(part: string): {basePath: string, openBracket: string, groupContent: string, closeBracket: string} | null {
        // Find the rightmost opening bracket that has a matching closing bracket at the end
        const openBrackets = ['[', '{', '('];
        const closeBrackets = [']', '}', ')'];
        
        for (let i = part.length - 1; i >= 0; i--) {
            const char = part[i];
            const closeIndex = closeBrackets.indexOf(char);
            
            if (closeIndex !== -1) {
                // Found a closing bracket, now look for matching opening bracket
                const expectedOpen = openBrackets[closeIndex];
                let bracketCount = 1;
                let openIndex = -1;
                
                for (let j = i - 1; j >= 0; j--) {
                    if (part[j] === char) {
                        bracketCount++;
                    } else if (part[j] === expectedOpen) {
                        bracketCount--;
                        if (bracketCount === 0) {
                            openIndex = j;
                            break;
                        }
                    }
                }
                
                if (openIndex !== -1) {
                    // Found matching brackets, check if this is at the end
                    if (i === part.length - 1) {
                        return {
                            basePath: part.substring(0, openIndex),
                            openBracket: expectedOpen,
                            groupContent: part.substring(openIndex + 1, i),
                            closeBracket: char
                        };
                    }
                }
                break; // Only check the rightmost closing bracket
            }
        }
        
        return null;
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
