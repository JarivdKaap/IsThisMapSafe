<template>
  <div>
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <b-container class="pt--8">
        <b-jumbotron
          text-variant="white"
          lead="Have a specific which isn't mentioned here? Feel free to DM JariK#3706 on Discord!"
          class="faq-jumbotron-content"
        >
          <template #header><div class="text-white">Have Any Questions?</div></template>
          <b-form class="navbar-search form-inline mr-sm-3 navbar-search-dark"
            role="form" @submit.prevent
            id="navbar-search-main">
            <b-form-group class="mb-0">
              <b-input-group class="input-group-alternative input-group-merge">
                <b-form-input placeholder="Search FAQ..." v-model="search" type="text"> </b-form-input>

                <div class="input-group-append" >
                  <span class="input-group-text"><i class="fas fa-search"></i></span>
                </div>
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-jumbotron>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>

    <b-container class="mt--8 pb-5">
      <b-row >
        <b-col md="5" lg="3" class="pt-3 pt-sm-3">
          <b-card>
            <h2>Table of Content</h2>
            <ul class="mt-4">
              <div
                v-for="category in categories"
                :key="category.id"
                class="p-1 font-medium row items-center"
                @click="faqFilter = category.id"
              >
                <div class="rounded-circle mr-2 mt-1" :class="'bg-' + category.color" :style="{height: '15px', width: '15px'}"></div>
                <h4 class="cursor-pointer align-self-center">{{ category.name }}</h4>
              </div>
            </ul>
          </b-card>
        </b-col>
        <b-col class="pt-3 pt-sm-3">
          <b-card>
            <div role="tablist" class="accordion">
              <b-card no-body class="mb-1"
                v-for="faq in filteredFaq"
                :key="faq.id"
              >
                <b-card-header header-tag="header" href="#" role="tab" v-b-toggle="'accordion-' + faq.id">
                  <h5 class="mb-0">{{faq.question}}</h5>
                </b-card-header>
                <b-collapse :id="'accordion-' + faq.id" invisible accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text v-html="faq.ans"></b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      faqFilter: 1,
      categories: [
        {
          id: 1,
          name: 'All',
          color: 'gray',
        },
        {
          id: 2,
          name: 'General',
          color: 'primary',
        },
        {
          id: 3,
          name: 'Privacy Policy',
          color: 'warning',
        },
      ],
      faqs: [
        {
          id: 1,
          categoryId: 2,
          question: 'Why does this exist?',
          ans: "There is an exploit in Black Ops III where a workshop item is able to access the filesystem, start programs, use the shell, etc. This site analyzes the files for workshop items for malisious code which can harm your computer."
        },
        {
          id: 8,
          categoryId: 2,
          question: 'How long does it take to analyze a workshop item?',
          ans: "We only analyze 1 item at the time so this depends on how long the queue is. For the item to be downloaded and analyzed it takes roughly 2 minutes."
        },
        {
          id: 2,
          categoryId: 2,
          question: 'How does this work?',
          ans: "When a workshop item get's requested it gets added to the queue, only 1 item van be validated at a time since it needs to be downloaded which takes some time. When it is downloaded it is being analyzed by searching for certain function calls inside GSC, CSC and lua files. This will return a status on how dangerous this item is. Sometimes the analyzes might find something suspisious but can't find something harmfull and will have an admin look at it further."
        },
        {
          id: 3,
          categoryId: 2,
          question: 'How can I contribute?',
          ans: "There are 2 ways you might be able to contribute. <ul><li>If you have knowledge of the different malicious function calls and want to help moderate the site, contact us and we'll see if you are suitable.</li><li>If you have knowledge of web development and want to help improve the site, you can have a look at our source-code and send a pull-request if you have created something you want to have added to the site.</li></ul>"
        },
        {
          id: 4,
          categoryId: 2,
          question: 'Where can I find the source-code to this site?',
          ans: "You can find the source code on github <a href='https://github.com/JarivdKaap/IsThisMapSafe' target='_blank'>Here</a>."
        },
        {
          id: 5,
          categoryId: 2,
          question: 'Can I run this analyzer on my own computer?',
          ans: "Yes, you can find this on Blakintosh's github <a href='https://github.com/Blakintosh/FastScanner' target='_blank'>Here</a>."
        },
        {
          id: 6,
          categoryId: 2,
          question: 'Can I 100% trust these results?',
          ans: "No, we do our best to make this as watertight as possible but as always there might still be some issues. If you find something malicious, please contact us so we can manually review this. <br><b>We are not liable for any damages because of a false negative.</b>"
        },
        {
          id: 9,
          categoryId: 2,
          question: 'Has development of this site ended?',
          ans: "No, we continue to add features that we see fit. You can also request features by contacting us. You can see what we're working on our <a href='https://trello.com/b/P44TRUI7/isthismapsafe' target='_blank'>Trello board</a>"
        },
        {
          id: 7,
          categoryId: 3,
          question: 'Privacy Policy',
          ans: '<h3>Privacy Policy for IsThisMapSafe</h3>At IsThisMapSafe, one of our priorities is the privacy of our visitors.<br><br>This Privacy Policy document contains types of information that is collected and recorded by IsThisMapSafe and how we use it.<br><br>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.<br><h3>General Data Protection Regulation (GDPR)</h3>We are a Data Controller of your information.<br><br>If you are a resident of the European Economic Area (EEA), you have certain data protection rights.<br>If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.<br><br>In certain circumstances, you have the following data protection rights:<ul><li>The right to access, update or to delete the information we have on you.</li><li>The right of rectification.</li><li>The right to object.</li><li>The right of restriction.</li><li>The right to data portability</li><li>The right to withdraw consent</li></ul><br><h3>Log Files</h3>IsThisMapSafe follows a standard procedure of using log files. These files log visitors when they visit websites.<br><br>The information collected by log files include:<ul><li>Internet protocol (IP) addresses</li><li>Browser type</li><li>Internet Service Provider (ISP)</li><li>Date and time stamp</li><li>Referring/exit pages</li><li>Items requested</li></ul>These are not linked to any information that is personally identifiable.<br><br>The purpose of the information is for analyzing trends, administering the site and preventing abuse.<br><br><h3>Our Advertising Partners</h3>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on IsThisMapSafe, which are sent directly to users\' browser.<br><br>They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.<br><br><h4>California Consumer Privacy Act (“CCPA”)</h4>Under CCPA, Californian residents have the right to declare their preferences on the sale of data for advertising and marketing purposes. If you wish to change your preferences, click this link to launch our preference portal:<br><br>Note that IsThisMapSafe has no access to or control over these cookies that are used by third-party advertisers.<br><br>We use a third-party to provide monetisation technologies for our site. You can review their privacy and cookie policy here.<br><br><h3>Third Party Privacy Policies</h3>IsThisMapSafe\'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.<br><br>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers\' respective websites.<br><h3>Consent</h3>By using our website, you hereby consent to our Privacy Policy and agree to its terms.'
        },
      ],
    }
  },
  computed: {
    filteredFaq() {
      return this.faqs.filter((faq) => {
        if (this.faqFilter == 1) return (faq.question.toLowerCase().includes(this.search.toLowerCase()) || faq.ans.toLowerCase().includes(this.search.toLowerCase()));
        return faq.categoryId == this.faqFilter && (faq.question.toLowerCase().includes(this.search.toLowerCase()) || faq.ans.toLowerCase().includes(this.search.toLowerCase()));
      });
    }
  },
}
</script>

<style scoped>
.faq-jumbotron-content {
  background-image: url('../../assets/images/pages/faq.jpg');
  background-size: cover;
}

.cursor-pointer{
  cursor: pointer;
}
</style>