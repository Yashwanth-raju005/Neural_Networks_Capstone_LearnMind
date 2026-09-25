QUIZ_BANK = {
    'web development': [
        {'id': 'web-1', 'topic': 'HTML', 'question': 'Which element creates a hyperlink?', 'options': ['<link>', '<a>', '<href>', '<url>'], 'answer': 1, 'explanation': 'The anchor element, <a>, creates links.'},
        {'id': 'web-2', 'topic': 'CSS', 'question': 'Which property changes text color?', 'options': ['font-style', 'background', 'color', 'text-decoration'], 'answer': 2, 'explanation': 'The color property controls text color.'},
        {'id': 'web-3', 'topic': 'JavaScript', 'question': 'Which keyword declares a block-scoped variable?', 'options': ['var', 'let', 'define', 'constant'], 'answer': 1, 'explanation': 'let creates a block-scoped binding.'},
        {'id': 'web-4', 'topic': 'React', 'question': 'What does a React component return?', 'options': ['SQL', 'A DOM-ready UI description', 'A CSS file', 'A server socket'], 'answer': 1, 'explanation': 'A component returns JSX or another UI description.'},
        {'id': 'web-5', 'topic': 'Node.js', 'question': 'Node.js primarily runs JavaScript where?', 'options': ['Only in CSS', 'On the server or outside the browser', 'Only in a database', 'Inside HTML attributes'], 'answer': 1, 'explanation': 'Node.js is a JavaScript runtime commonly used on servers.'},
    ],
    'data structures': [
        {'id': 'ds-1', 'topic': 'Arrays', 'question': 'What is the typical lookup time by index in an array?', 'options': ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 'answer': 0, 'explanation': 'An array index can usually be accessed directly in O(1).'},
        {'id': 'ds-2', 'topic': 'Linked Lists', 'question': 'What does a linked-list node normally contain?', 'options': ['Only a number', 'Data and a link to another node', 'A SQL query', 'A sorted array'], 'answer': 1, 'explanation': 'Nodes store data plus a pointer or reference.'},
        {'id': 'ds-3', 'topic': 'Trees', 'question': 'In a binary tree, each node has at most how many children?', 'options': ['1', '2', '3', 'Unlimited'], 'answer': 1, 'explanation': 'Binary nodes have at most a left and right child.'},
        {'id': 'ds-4', 'topic': 'Graphs', 'question': 'What does an edge represent in a graph?', 'options': ['A relationship between vertices', 'A sorting operation', 'A stack frame', 'An array index'], 'answer': 0, 'explanation': 'Edges connect vertices and model relationships.'},
        {'id': 'ds-5', 'topic': 'Dynamic Programming', 'question': 'What is a key idea in dynamic programming?', 'options': ['Ignoring repeated work', 'Storing results of overlapping subproblems', 'Always using recursion', 'Random search'], 'answer': 1, 'explanation': 'Dynamic programming reuses stored subproblem results.'},
    ],
    'artificial intelligence': [
        {'id': 'ai-1', 'topic': 'ML Basics', 'question': 'What is a feature in a machine-learning dataset?', 'options': ['An input variable', 'The final prediction only', 'A password', 'A model file'], 'answer': 0, 'explanation': 'Features are input variables used by a model.'},
        {'id': 'ai-2', 'topic': 'Neural Networks', 'question': 'What is the purpose of an activation function?', 'options': ['Add non-linearity', 'Store passwords', 'Sort data', 'Create a database'], 'answer': 0, 'explanation': 'Activation functions let networks learn non-linear relationships.'},
        {'id': 'ai-3', 'topic': 'Training', 'question': 'What does a loss function measure?', 'options': ['Prediction error', 'Disk size', 'Number of users', 'Network speed'], 'answer': 0, 'explanation': 'Loss measures how far predictions are from target values.'},
        {'id': 'ai-4', 'topic': 'Evaluation', 'question': 'Why use a test set?', 'options': ['Measure generalization on unseen data', 'Train forever', 'Replace the labels', 'Increase file size'], 'answer': 0, 'explanation': 'A test set estimates performance on unseen examples.'},
        {'id': 'ai-5', 'topic': 'Ethics', 'question': 'What can biased training data cause?', 'options': ['Unfair or unreliable predictions', 'Guaranteed accuracy', 'Faster hardware', 'More storage'], 'answer': 0, 'explanation': 'Biased data can produce systematically unfair results.'},
    ],
    'python': [
        {'id': 'py-1', 'topic': 'Syntax', 'question': 'Which collection is ordered and mutable?', 'options': ['Tuple', 'List', 'Set', 'Frozen set'], 'answer': 1, 'explanation': 'Python lists preserve order and can be changed.'},
        {'id': 'py-2', 'topic': 'Functions', 'question': 'Which keyword defines a function?', 'options': ['func', 'def', 'function', 'lambda-only'], 'answer': 1, 'explanation': 'Python uses def to define named functions.'},
        {'id': 'py-3', 'topic': 'Dictionaries', 'question': 'How are dictionary values accessed?', 'options': ['By key', 'Only by position', 'By CSS selector', 'By SQL join'], 'answer': 0, 'explanation': 'Dictionaries map keys to values.'},
        {'id': 'py-4', 'topic': 'Errors', 'question': 'Which block handles an exception?', 'options': ['try/except', 'if/else only', 'switch/case', 'catch/finally only'], 'answer': 0, 'explanation': 'try/except handles exceptions in Python.'},
        {'id': 'py-5', 'topic': 'Iteration', 'question': 'What does range(3) produce for a loop?', 'options': ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', 'Only 3'], 'answer': 1, 'explanation': 'range(3) starts at zero and stops before three.'},
    ],
}

TOPIC_RESOURCES = {
    'web': [
        {'topic': 'HTML Basics', 'description': 'Learn document structure, semantic elements, headings, links, and accessible page content.', 'resources': {'video': 'https://www.youtube.com/watch?v=pQN-pnXPaVg', 'documentation': 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML', 'practice': 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'}},
        {'topic': 'CSS Fundamentals', 'description': 'Practice selectors, the cascade, box model, layout, and responsive styling.', 'resources': {'video': 'https://www.youtube.com/watch?v=OXGznpKZ_sA', 'documentation': 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps', 'practice': 'https://www.freecodecamp.org/learn/2022/responsive-web-design/basic-css/'}},
        {'topic': 'JavaScript Basics', 'description': 'Build a foundation with variables, functions, arrays, objects, and control flow.', 'resources': {'video': 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 'documentation': 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps', 'practice': 'https://javascript.info/first-steps'}},
        {'topic': 'DOM Manipulation', 'description': 'Connect JavaScript to a page by selecting, changing, and listening to DOM elements.', 'resources': {'documentation': 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction', 'practice': 'https://www.frontendmentor.io/challenges'}},
        {'topic': 'React Components', 'description': 'Compose interfaces with components, props, state, and predictable data flow.', 'resources': {'documentation': 'https://react.dev/learn/your-first-component', 'practice': 'https://react.dev/learn/tutorial-tic-tac-toe', 'additional': 'https://react.dev/learn'}},
    ],
    'data structures': [
        {'topic': 'Arrays', 'description': 'Understand indexed storage, traversal, searching, and common array tradeoffs.', 'resources': {'documentation': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', 'practice': 'https://leetcode.com/problemset/?topicSlugs=array'}},
        {'topic': 'Linked Lists', 'description': 'Learn nodes, pointers, insertion, deletion, and linked-list traversal.', 'resources': {'documentation': 'https://en.wikipedia.org/wiki/Linked_list', 'practice': 'https://leetcode.com/tag/linked-list/'}},
        {'topic': 'Trees', 'description': 'Model hierarchical data with roots, children, traversal, and balanced structures.', 'resources': {'documentation': 'https://www.geeksforgeeks.org/introduction-to-tree-data-structure/', 'practice': 'https://leetcode.com/tag/tree/'}},
        {'topic': 'Graphs', 'description': 'Represent relationships and solve traversal problems with BFS and DFS.', 'resources': {'documentation': 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', 'practice': 'https://leetcode.com/tag/graph/'}},
        {'topic': 'Dynamic Programming', 'description': 'Break problems into overlapping subproblems and reuse their computed results.', 'resources': {'documentation': 'https://www.geeksforgeeks.org/dynamic-programming/', 'practice': 'https://leetcode.com/tag/dynamic-programming/'}},
    ],
    'python': [
        {'topic': 'Python Syntax and Types', 'description': 'Learn expressions, values, variables, and Python control flow.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/introduction.html', 'practice': 'https://www.hackerrank.com/domains/python'}},
        {'topic': 'Functions and Modules', 'description': 'Organize reusable logic with functions, arguments, return values, and imports.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', 'practice': 'https://exercism.org/tracks/python'}},
        {'topic': 'Collections', 'description': 'Choose between lists, tuples, sets, and dictionaries for real tasks.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/datastructures.html', 'practice': 'https://www.hackerrank.com/domains/python/py-basic-data-types'}},
        {'topic': 'Exceptions and Files', 'description': 'Handle failures deliberately and work safely with file input and output.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/errors.html', 'practice': 'https://realpython.com/working-with-files-in-python/'}},
        {'topic': 'Object-Oriented Python', 'description': 'Model related data and behavior with classes, objects, and composition.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/classes.html', 'practice': 'https://exercism.org/tracks/python/exercises'}},
    ],
    'artificial intelligence': [
        {'topic': 'Machine Learning Foundations', 'description': 'Understand datasets, features, labels, training, and evaluation.', 'resources': {'documentation': 'https://developers.google.com/machine-learning/intro-to-ml', 'practice': 'https://www.kaggle.com/learn/intro-to-machine-learning'}},
        {'topic': 'Neural Networks', 'description': 'Learn layers, activations, loss functions, and how networks learn patterns.', 'resources': {'documentation': 'https://www.tensorflow.org/guide/keras/sequential_model', 'practice': 'https://www.tensorflow.org/tutorials/quickstart/beginner'}},
        {'topic': 'Model Evaluation', 'description': 'Compare predictions with labels and reason about generalization and error.', 'resources': {'documentation': 'https://scikit-learn.org/stable/modules/model_evaluation.html', 'practice': 'https://www.kaggle.com/learn/intro-to-machine-learning'}},
        {'topic': 'Feature Engineering', 'description': 'Prepare meaningful inputs that help a model learn useful signals.', 'resources': {'documentation': 'https://scikit-learn.org/stable/modules/preprocessing.html', 'practice': 'https://www.kaggle.com/learn/feature-engineering'}},
        {'topic': 'Responsible AI', 'description': 'Identify bias, privacy, reliability, and human-impact risks in AI systems.', 'resources': {'documentation': 'https://ai.google/responsibilities/responsible-ai-practices/', 'practice': 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics'}},
    ],
    'ai engineer': [
        {'topic': 'AI Engineering Foundations', 'description': 'Understand the systems, data, models, and evaluation loops used by AI engineers.', 'resources': {'documentation': 'https://developers.google.com/machine-learning/crash-course', 'video': 'https://www.youtube.com/watch?v=aircAruvnKk', 'practice': 'https://www.kaggle.com/learn/intro-to-machine-learning'}},
        {'topic': 'Python for AI', 'description': 'Build the Python fluency needed to prepare data and work with model libraries.', 'resources': {'documentation': 'https://docs.python.org/3/tutorial/', 'video': 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'practice': 'https://exercism.org/tracks/python'}},
        {'topic': 'Data Preparation for AI', 'description': 'Clean, transform, split, and validate data before training an AI system.', 'resources': {'documentation': 'https://scikit-learn.org/stable/modules/preprocessing.html', 'practice': 'https://www.kaggle.com/learn/data-cleaning'}},
        {'topic': 'Neural Network Development', 'description': 'Train, evaluate, and improve neural networks with layers, losses, and metrics.', 'resources': {'documentation': 'https://www.tensorflow.org/guide/keras/sequential_model', 'video': 'https://www.youtube.com/watch?v=aircAruvnKk', 'practice': 'https://www.tensorflow.org/tutorials/quickstart/beginner'}},
        {'topic': 'AI Deployment and MLOps', 'description': 'Package AI models behind reliable APIs and monitor their behavior in production.', 'resources': {'documentation': 'https://mlops.community/', 'practice': 'https://www.kaggle.com/learn/intro-to-deep-learning'}},
    ],
}


def _key(value):
    return (value or '').strip().lower()


def _topic_set(domain, career_goal=None):
    key = _key(domain)
    career_key = _key(career_goal)
    if 'ai engineer' in career_key:
        return TOPIC_RESOURCES['ai engineer']
    if 'data structure' in key or key in ('dsa', 'algorithms'):
        return TOPIC_RESOURCES['data structures']
    if 'python' in key:
        return TOPIC_RESOURCES['python']
    if any(value in key for value in ('web', 'frontend', 'backend', 'full stack', 'javascript', 'react')):
        return TOPIC_RESOURCES['web']
    if 'artificial intelligence' in key or any(value in key for value in (' ai', 'machine learning', 'data science')):
        return TOPIC_RESOURCES['artificial intelligence']
    subject = domain or 'Learning'
    return [
        {'topic': f'{subject} Orientation', 'description': f'Understand the vocabulary, tools, and outcomes for {subject}.', 'resources': {}},
        {'topic': f'{subject} Core Concepts', 'description': f'Learn the essential principles that every {subject} learner needs.', 'resources': {}},
        {'topic': f'{subject} Setup and Workflow', 'description': f'Set up a repeatable workflow and practice the basic tools used in {subject}.', 'resources': {}},
        {'topic': f'{subject} Guided Practice', 'description': f'Complete small guided exercises that reinforce the foundations of {subject}.', 'resources': {}},
        {'topic': f'{subject} Problem Solving', 'description': f'Break down common {subject} problems and choose an appropriate solution.', 'resources': {}},
        {'topic': f'{subject} Debugging and Review', 'description': f'Find mistakes, test assumptions, and explain your corrections in {subject}.', 'resources': {}},
        {'topic': f'{subject} Applied Mini Project', 'description': f'Build a small artifact that demonstrates your growing {subject} skills.', 'resources': {}},
        {'topic': f'{subject} Intermediate Techniques', 'description': f'Combine multiple concepts and improve the quality of your {subject} work.', 'resources': {}},
        {'topic': f'{subject} Portfolio Challenge', 'description': f'Create a polished project connected to your {subject} career goal.', 'resources': {}},
        {'topic': f'{subject} Advanced Capstone', 'description': f'Solve a more open-ended challenge and defend your decisions with evidence.', 'resources': {}},
    ]


def build_topic_checklist(domain, career_goal, resource_focus='Both'):
    checklist = []
    index = 1
    stages = [('Foundation', 'Learn'), ('Guided Practice', 'Practice'), ('Advanced Application', 'Apply')]
    focus = _key(resource_focus)
    for item in _topic_set(domain, career_goal):
        for stage, action in stages:
            resources = {key: value for key, value in item['resources'].items() if value.startswith('https://')}
            if focus == 'documentation':
                resources = {key: value for key, value in resources.items() if key == 'documentation'}
            elif focus == 'video':
                resources = {key: value for key, value in resources.items() if key == 'video'}
            elif focus in ('projects', 'practice'):
                resources = {key: value for key, value in resources.items() if key in ('practice', 'additional')}
            primary = resources.get('video') or resources.get('documentation') or resources.get('practice') or ''
            checklist.append({
                'task_id': f'topic-{index}',
                'title': f'{stage}: {item["topic"]}',
                'description': f'{action} this checkpoint. {item["description"]} Connect it to your {career_goal or "career"} goal.',
                'resource_type': 'Topic resources',
                'resource_url': primary,
                'resources': resources,
                'points': 10 if stage == 'Foundation' else 12,
            })
            index += 1
    return checklist


def get_quiz_catalog(domain):
    key = _key(domain)
    matching = next((name for name in QUIZ_BANK if name in key or key in name), 'artificial intelligence')
    questions = QUIZ_BANK[matching]
    return [{'id': f'{matching.replace(" ", "-")}-basics', 'title': f'{matching.title()} essentials', 'domain': matching.title(), 'question_count': len(questions)}]


def get_quiz(domain, quiz_id):
    catalog = get_quiz_catalog(domain)
    if not catalog or catalog[0]['id'] != quiz_id:
        return None
    key = _key(domain)
    matching = next((name for name in QUIZ_BANK if name in key or key in name), 'artificial intelligence')
    return {'id': quiz_id, 'title': catalog[0]['title'], 'domain': catalog[0]['domain'], 'questions': QUIZ_BANK[matching]}


def _concept_from_history(history, fallback):
    for message in reversed(history or []):
        if message.get('role') == 'user' and len(message.get('body', '').split()) > 2:
            text = message['body'].strip().rstrip('?')
            for prefix in ('what is ', 'explain ', 'why does ', 'why do '):
                if _key(text).startswith(prefix):
                    return text[len(prefix):].strip()
            return text
    return fallback


def answer_assistant(question, domain, roadmap, progress, history=None, topic=None):
    text = _key(question)
    context = domain or 'your learning domain'
    history_topic = _concept_from_history(history, 'your next roadmap topic')
    is_follow_up = any(phrase in text for phrase in ('that', 'it', 'this', 'again', 'example', 'why does', 'why do', 'hint'))
    current_topic = history_topic if is_follow_up else (topic or history_topic)
    if roadmap and roadmap.get('tasks') and not topic:
        current_topic = next((task['title'] for task in roadmap['tasks'] if not task.get('completed')), current_topic)
    concept = current_topic
    if 'let' in text and 'var' in text:
        response = 'In JavaScript, let is block-scoped while var is function-scoped. Prefer let for values that change and const for values that do not. Example: if (true) { let count = 1; } keeps count inside that block.'
    elif ('closure' in text or 'closure' in _key(concept)) and ('example' in text or 'code' in text):
        response = 'A closure remembers variables from its outer function: function makeCounter() { let count = 0; return () => ++count; } const next = makeCounter(); next() returns 1 and the next call returns 2 because the inner function keeps access to count.'
    elif 'closure' in text:
        response = 'A JavaScript closure is a function bundled with access to the variables around it. The inner function can use those variables even after the outer function has returned. It is useful for private state and callbacks.'
    elif 'rest' in text and 'graphql' in text:
        response = 'REST exposes resources through multiple endpoint URLs, while GraphQL usually exposes one endpoint where the client asks for an exact shape. REST is simple and cache-friendly; GraphQL can reduce over-fetching when clients need different fields.'
    elif 'rest api' in text or 'restful' in text:
        response = 'A REST API lets a client work with resources through HTTP. For example, GET /students reads students, POST /students creates one, and PUT /students/7 updates one. The server responds with data, commonly JSON, and each request is independent.'
    elif 'binary search' in text:
        response = 'Binary search works on sorted data by checking the middle item and discarding half the remaining range each time. Its time complexity is O(log n). Hint: decide whether the target is left or right of the middle before updating the bounds.' if 'hint' in text else 'Binary search repeatedly checks the middle of a sorted collection and keeps only the half that can contain the target. That halves the search space each time, giving O(log n) time.'
    elif 'recursion' in text or 'base case' in text:
        response = 'Recursion solves a problem by calling the same function on a smaller input. It stops at the base case, such as factorial(0) = 1; without that case, calls continue until the call stack fails.'
    elif 'practice' in text or 'mcq' in text or 'question' in text and ('give' in text or 'quiz' in text):
        response = f'Practice question for {concept}: explain the idea in one sentence, then write a tiny example that demonstrates it. For a challenge, predict the output before running your code and explain why.'
    elif 'hint' in text:
        response = f'Hint for {concept}: identify the input and the result you need first. Trace the smallest example by hand, then change only one value and observe what changes. I will leave the final solution to you.'
    elif 'example' in text or 'code' in text:
        response = f'Here is a small example for {concept}: start with one input, apply the core operation once, and print the result. Then change the input and predict the output before running it. Tell me the language if you want code tailored to it.'
    elif 'simpl' in text or "don't understand" in text or 'do not understand' in text or 'confus' in text or 'again' in text:
        response = f'No problem. Think of {concept} as a small process with three parts: what goes in, what happens, and what comes out. Would you like a real-world analogy, a short code example, or both?'
    elif 'explain' in text or 'what is' in text:
        response = f'{concept} is a core idea in {context}. Start with its purpose, then trace one small input through the process and observe the result. A useful check is to explain what problem it solves and what would happen without it.'
    elif 'compare' in text or 'difference' in text:
        response = f'To compare concepts in {context}, list what each one stores, how it behaves, and when you would choose it. For {question.strip()}, start with the common goal, then contrast the trade-off that matters most.'
    elif 'summary' in text or 'summar' in text:
        response = f'Summary of {concept}: learn the definition, trace one small example, practice one variation, and check your explanation against the roadmap checkpoint. Your tracked progress is {progress.get("overall_progress", 0)}%.'
    elif ('why' in text or 'stop' in text) and ('recursion' in _key(concept) or 'base case' in text or any('recursion' in _key(message.get('body')) for message in (history or []))):
        response = 'It stops because the recursive call reaches a base case. In factorial, factorial(0) returns 1 without calling factorial again; each earlier call then receives its result. Without that stopping condition, the function keeps creating calls.'
    elif 'why' in text:
        response = f'For {concept}, the reason is usually tied to the problem it solves: it makes an operation clearer, safer, or more efficient. Trace one concrete input through each step and ask what would break if that step were removed.'
    else:
        response = f'For your {context} question about {concept}, begin by naming the input, the expected result, and one example. I can make this more specific if you share the code, error, or part that feels unclear.'
    return response
