// Framework templates for common project structures
export interface FrameworkTemplate {
    id: string;
    name: string;
    description: string;
    expression: string;
    category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'other';
}

export const FRAMEWORK_TEMPLATES: FrameworkTemplate[] = [
    // React Templates
    {
        id: 'react-basic',
        name: 'React Basic Structure',
        description: 'Basic React project with components, hooks, and utilities',
        expression: 'src/{components/{Header.jsx,Footer.jsx,Navigation.jsx},hooks/{useAuth.js,useApi.js},utils/{helpers.js,constants.js},pages/{Home.jsx,About.jsx},styles/{index.css,components.css}} + public/{index.html,favicon.ico}',
        category: 'frontend'
    },
    {
        id: 'react-advanced',
        name: 'React Advanced Structure',
        description: 'Advanced React project with context, services, and testing',
        expression: 'src/{components/{common/{Button.jsx,Modal.jsx,Loading.jsx},layout/{Header.jsx,Footer.jsx,Sidebar.jsx}},context/{AuthContext.js,ThemeContext.js},services/{api.js,auth.js},hooks/{useAuth.js,useLocalStorage.js,useApi.js},utils/{helpers.js,constants.js,validators.js},pages/{Home.jsx,Dashboard.jsx,Profile.jsx,Login.jsx},styles/{index.css,components.css,variables.css},__tests__/{components/Button.test.jsx,utils/helpers.test.js}} + public/{index.html,favicon.ico,manifest.json}',
        category: 'frontend'
    },
    
    // Next.js Templates
    {
        id: 'nextjs-basic',
        name: 'Next.js Basic Structure',
        description: 'Basic Next.js project with app router',
        expression: 'app/{page.tsx,layout.tsx,loading.tsx,error.tsx,not-found.tsx,(dashboard)/{page.tsx,layout.tsx,analytics/page.tsx,settings/page.tsx},api/{users/route.ts,auth/route.ts}} + components/{Header.tsx,Footer.tsx,Navigation.tsx} + lib/{utils.ts,auth.ts} + styles/{globals.css,components.css}',
        category: 'frontend'
    },
    {
        id: 'nextjs-advanced',
        name: 'Next.js Advanced Structure',
        description: 'Advanced Next.js project with full features',
        expression: 'app/{page.tsx,layout.tsx,loading.tsx,error.tsx,not-found.tsx,globals.css,(auth)/{login/page.tsx,register/page.tsx,layout.tsx},(dashboard)/{page.tsx,layout.tsx,analytics/page.tsx,settings/page.tsx,users/page.tsx},(marketing)/{about/page.tsx,contact/page.tsx,pricing/page.tsx},api/{auth/{login/route.ts,register/route.ts,logout/route.ts},users/{route.ts,[id]/route.ts},posts/{route.ts,[id]/route.ts}}} + components/{ui/{Button.tsx,Modal.tsx,Input.tsx,Card.tsx},layout/{Header.tsx,Footer.tsx,Sidebar.tsx,Navigation.tsx},forms/{LoginForm.tsx,RegisterForm.tsx,ContactForm.tsx}} + lib/{auth.ts,db.ts,utils.ts,validations.ts,constants.ts} + middleware.ts + types/{auth.ts,user.ts,post.ts} + hooks/{useAuth.ts,useLocalStorage.ts,useDebounce.ts}',
        category: 'frontend'
    },
    
    // Svelte Templates
    {
        id: 'svelte-basic',
        name: 'Svelte Basic Structure',
        description: 'Basic Svelte project structure',
        expression: 'src/{routes/{+page.svelte,+layout.svelte,about/+page.svelte,contact/+page.svelte},components/{Header.svelte,Footer.svelte,Navigation.svelte},lib/{stores.js,utils.js,api.js},styles/{app.css,components.css}} + static/{favicon.png,app.html}',
        category: 'frontend'
    },
    
    // Go Templates
    {
        id: 'go-web-api',
        name: 'Go Web API',
        description: 'Go web API with clean architecture',
        expression: 'cmd/api/main.go + internal/{handlers/{users.go,auth.go,health.go},models/{user.go,auth.go},repository/{user_repository.go,auth_repository.go},services/{user_service.go,auth_service.go},middleware/{auth.go,cors.go,logging.go},config/config.go} + pkg/{database/{postgres.go,migrations/},utils/{helpers.go,validators.go},logger/logger.go} + api/{v1/openapi.yaml} + scripts/{build.sh,test.sh} + deployments/{docker/Dockerfile,k8s/deployment.yaml} + go.mod + .env.example + README.md',
        category: 'backend'
    },
    {
        id: 'go-cli',
        name: 'Go CLI Application',
        description: 'Go CLI application structure',
        expression: 'cmd/{root.go,version.go,serve.go} + internal/{config/config.go,commands/{serve.go,version.go},utils/helpers.go} + pkg/{logger/logger.go,version/version.go} + scripts/{build.sh,install.sh} + main.go + go.mod + README.md',
        category: 'backend'
    },
    
    // Python Templates
    {
        id: 'python-flask',
        name: 'Python Flask API',
        description: 'Flask REST API with blueprints',
        expression: 'app/{__init__.py,models/{__init__.py,user.py,auth.py},routes/{__init__.py,users.py,auth.py,health.py},services/{__init__.py,user_service.py,auth_service.py},utils/{__init__.py,helpers.py,validators.py},config.py} + migrations/ + tests/{__init__.py,test_users.py,test_auth.py,conftest.py} + requirements.txt + .env.example + run.py + README.md',
        category: 'backend'
    },
    {
        id: 'python-fastapi',
        name: 'Python FastAPI',
        description: 'FastAPI with async structure',
        expression: 'app/{__init__.py,main.py,models/{__init__.py,user.py,auth.py},routers/{__init__.py,users.py,auth.py,health.py},services/{__init__.py,user_service.py,auth_service.py},dependencies/{__init__.py,auth.py,database.py},utils/{__init__.py,helpers.py,validators.py},config.py,database.py} + alembic/{env.py,script.py.mako,versions/} + tests/{__init__.py,test_users.py,test_auth.py,conftest.py} + requirements.txt + .env.example + README.md',
        category: 'backend'
    },
    
    // Django Templates
    {
        id: 'django-basic',
        name: 'Django Basic Project',
        description: 'Basic Django project with apps',
        expression: 'manage.py + config/{__init__.py,settings.py,urls.py,wsgi.py,asgi.py} + apps/{users/{__init__.py,models.py,views.py,urls.py,admin.py,apps.py,serializers.py,tests.py},core/{__init__.py,models.py,views.py,urls.py,admin.py,apps.py,tests.py}} + static/{css/,js/,images/} + templates/{base.html,users/,core/} + media/ + requirements.txt + .env.example',
        category: 'backend'
    },
    
    // Full-stack Templates
    {
        id: 'mern-stack',
        name: 'MERN Stack',
        description: 'Full MERN stack project structure',
        expression: 'client/{src/{components/{common/{Button.jsx,Modal.jsx},layout/{Header.jsx,Footer.jsx}},pages/{Home.jsx,Dashboard.jsx,Login.jsx},hooks/{useAuth.js,useApi.js},services/api.js,context/AuthContext.js,utils/helpers.js,App.jsx,index.js},public/{index.html,favicon.ico},package.json} + server/{src/{controllers/{authController.js,userController.js},models/{User.js,Auth.js},routes/{auth.js,users.js},middleware/{auth.js,errorHandler.js},config/{database.js,jwt.js},utils/helpers.js,app.js,server.js},package.json,.env.example} + README.md + .gitignore',
        category: 'fullstack'
    },
    
    // Mobile Templates
    {
        id: 'react-native-basic',
        name: 'React Native Basic',
        description: 'Basic React Native project structure',
        expression: 'src/{components/{common/{Button.jsx,Input.jsx,Loading.jsx},navigation/AppNavigator.jsx},screens/{HomeScreen.jsx,ProfileScreen.jsx,LoginScreen.jsx},hooks/{useAuth.js,useApi.js},services/{api.js,storage.js},utils/{helpers.js,constants.js},context/AuthContext.js,App.jsx} + android/ + ios/ + package.json + app.json',
        category: 'mobile'
    },
    
    // Testing Templates
    {
        id: 'testing-structure',
        name: 'Testing Structure',
        description: 'Comprehensive testing setup',
        expression: '__tests__/{unit/{components/,utils/,services/},integration/{api/,database/},e2e/} + tests/{fixtures/,mocks/,helpers/} + jest.config.js + cypress.config.js + .github/workflows/test.yml',
        category: 'other'
    },
    
    // Documentation Templates
    {
        id: 'docs-structure',
        name: 'Documentation Structure',
        description: 'Complete documentation setup',
        expression: 'docs/{getting-started.md,api/{endpoints.md,authentication.md,examples.md},guides/{installation.md,configuration.md,deployment.md},tutorials/,reference/,assets/{images/,diagrams/}} + README.md + CONTRIBUTING.md + CHANGELOG.md + LICENSE',
        category: 'other'
    }
];

export function getFrameworkTemplatesByCategory(category?: string): FrameworkTemplate[] {
    if (!category) {
        return FRAMEWORK_TEMPLATES;
    }
    return FRAMEWORK_TEMPLATES.filter(template => template.category === category);
}

export function getFrameworkTemplateById(id: string): FrameworkTemplate | undefined {
    return FRAMEWORK_TEMPLATES.find(template => template.id === id);
}

export function getCategories(): string[] {
    return Array.from(new Set(FRAMEWORK_TEMPLATES.map(template => template.category)));
}
