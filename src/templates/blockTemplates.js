import { bgColors } from '../constants/colors.js';
export let blockTemplates = [{
	'blockTypeId': 1,
	'label': 'Welcome',
	'title': 'Hello There 😀', 
	'description': 'Mind giving this form a quick fill?',
	'embed': '',
	'buttonText' : 'Let´s Start', 
	'component': 'Welcome',
	'textAlign' : 'center',
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[0]
},{
	'blockTypeId': 2,
	'label': 'Short Text Block', 
	'question': 'Your question here...', 
	'description': '',
	'component' : 'ShortText',
	'buttonText' : 'Next', 
	'validation': {
		'required': false,
	},
	'props': {
		'placeholder' : 'Your answer here...'
	},
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[1]
},{
	'blockTypeId': 3,
	'label': 'Long Text Block', 
	'question': 'Your question here...',
	'description': '',
	'component' : 'LongText',
	'buttonText' : 'Next', 
	'validation': {
      'required': false,
    },
	'props': {
		'placeholder' : 'Your answer here...',
		'maxCharacters': '',
		'size': 'Medium'
	},
	'textAlign' : 'left',
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[2]
},{
	'blockTypeId': 4,	
	'label': 'Single Select Option', 
	'question': 'Which do you prefer?', 
	'description': '',
	'component' : 'Select',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {
		'choices': ['Ireland', 'France', 'Germany', 'United States'],
		'multiple': false
	},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[3]
},
{
	'blockTypeId': 5,	
	'label': 'Multi Select Option', 
	'question': 'Please choose at least one option', 
	'description': '',
	'component' : 'Select',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {
		'choices': ['Lions', 'Tigers', 'Bears', 'Fish'],
		'multiple': true
	},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[4]
},
{
	'blockTypeId': 6,	
	'label': 'Dropdown', 
	'question': 'Please choose ', 
	'description': '',
	'component' : 'DropdownBlock',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {
		'choices': ['One', 'Two', 'Three']
	},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[5]
},
{
	'blockTypeId': 7,	
	'label': 'StarRating', 
	'question': 'How would you rate your experience?', 
	'description': '',
	'component' : 'StarRating',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {
		'maxRating' : '5'
	},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[6]
},
{
	'blockTypeId': 8,	
	'label': 'DatePicker', 
	'question': 'Please select a date', 
	'description': '',
	'component' : 'DatePicker',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[7]
},
{
	'blockTypeId': 9,	
	'label': 'Number', 
	'question': 'Please enter a number', 
	'description': '',
	'component' : 'Number',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {placeholder: ''},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[8]
},
{
	'blockTypeId': 10,	
	'label': 'OpinionScale', 
	'question': 'How likely are you to recommend us?', 
	'description': '',
	'component' : 'OpinionScale',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {
		'start' : '1',
		'end' : '10',
		'leftLabel' : 'Good',
		'rightLabel': 'Bad'
	},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[9]
},
{
	'blockTypeId': 11,	
	'label': 'PhoneNumber', 
	'question': 'Please enter a phone number', 
	'description': '',
	'component' : 'PhoneNumber',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[10]
},
{
	'blockTypeId': 12,	
	'label': 'Statement', 
	'title': '', 
	'description': '',
	'component' : 'Statement',
	'buttonText' : 'Next',
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[11]
},
{
	'blockTypeId': 13,	
	'label': 'Signature', 
	'question': '', 
	'description': '',
	'component' : 'Signature',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[12]
},
{
	'blockTypeId': 14,	
	'label': 'Website URL', 
	'question': 'Please enter a URL', 
	'description': '',
	'component' : 'Website',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[13]
},
{
	'blockTypeId': 15,	
	'label': 'Scheduler URL', 
	'question': '', 
	'description': '',
	'component' : 'Scheduler',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[14]
},
{
	'blockTypeId': 16,	
	'label': 'FileUploader', 
	'question': '', 
	'description': '',
	'component' : 'FileUploader',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	'props': {},
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[15]
},
{
	'blockTypeId': 17,
	'label': 'Email', 
	'question': 'Your your email address?', 
	'description': '',
	'component' : 'Email',
	'buttonText' : 'Next', 
	'validation': {
		'required': false,
	},
	'props': {
		'placeholder' : 'Your answer here...'
	},
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[16]
},
{
	'blockTypeId': 18,
	'label': 'Checkox', 
	'question': 'Please check if....', 
	'description': '',
	'component' : 'CheckboxBlock',
	'buttonText' : 'Next', 
	'validation': {
		'required': false,
	},
	'props': {
		'placeholder' : 'Your answer here...'
	},
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[17]
},
{
	'blockTypeId': 19,	
	'label': 'MoodMeter', 
	'question': 'How did we make you feel?', 
	'description': '',
	'component' : 'MoodMeter',
	'buttonText' : 'Next',
	'validation': {
		'required': false
	},
	
    'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[18]
},
{
	'blockTypeId': 20,
	'label': 'Stripe',
	'title': 'Stripe', 
	'description': 'Stripe',
	'embed': '',
	
	'component': 'Stripe',
	'textAlign' : 'center',
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[19]

},

{
	'blockTypeId': 21,
	'label': 'ThankYou',
	'title': 'Thanks 😀', 
	'description': 'Thanks',
	'embed': '',
	
	'component': 'ThankYou',
	'textAlign' : 'center',
	'coverImageProps': {
	'coverImage': '',
	'layout' : ''
    },
	'bgColor' : bgColors[20]

},




]