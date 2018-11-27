import os
from collections import deque



class LoadData(object):

    def __init__(self):
        self.currentDir = os.path.dirname(os.path.abspath(__file__))

        self.simuHeadInitial = []
        self.simuBodyInitial = []
        self.simuTailInitial = []

        self.simuHeadRuleset = []
        self.simuBodyRuleset = []
        self.simuTailRuleset = []

        self.simuHeadTranscript = []
        self.simuTailTranscript = []

        self.ruleset = []
        self.transcript = []
        self.initial = []

    def makeDir(self):
        if(not os.path.isdir('output')):
            os.mkdir('output')

    def readyToWrite(self):
        for el in self.ruleset:
            self.simuBodyRuleset.append('OSVars.ruleset[' +el[0]+ '][' +el[1]+ ']  = true;')


        self.simuBodyTranscript = '<textarea name="word" cols="50" rows="5">99'
        for el in self.transcript:
            self.simuBodyTranscript += ','
            self.simuBodyTranscript += el

        self.simuBodyTranscript += '</textarea>'

        for el in self.initial:
            one_init = []
            for el2 in el[2]:
                one_init.append('setSeed(' +str(el2[0])+ ',' +str(el2[1])+ ', { beadType: ' +el2[2]+ ', index : -3, bondNum : 0 } );')
            one_init.append('OSVars.w_path = [')
            one_init.append('{x: ' +str(el[0])+ ', y: ' +str(el[1])+ '}')
            one_init.append('];')

            self.simuBodyInitial.append(one_init)

    def writeFiles(self):
        co = 0
        for el in self.simuBodyInitial:
            file_st = 'output/initial'+ str(co) +'.js'
            inif = open(file_st, 'w')
            co += 1;

            self.writeAFile(self.simuHeadInitial,inif)
            self.writeAFile(el,inif)
            self.writeAFile(self.simuTailInitial, inif)


        rulef = open('output/formControl.js', 'w')
        trf = open('output/os_simu.html', 'w')

        self.writeAFile(self.simuHeadRuleset,rulef)
        self.writeAFile(self.simuBodyRuleset,rulef)
        self.writeAFile(self.simuTailRuleset,rulef)

        self.writeAFile(self.simuHeadTranscript,trf)
        trf.write(self.simuBodyTranscript)
        self.writeAFile(self.simuTailTranscript,trf)

    def writeAFile(self, list, f):
        f.write('\n'.join(list))

    def loadSimuFile(self):
        self.head_tail_Open('initial.js' , self.simuHeadInitial, self.simuTailInitial, '//forMyOS.initial::start','//forMyOS.initial::end')
        self.head_tail_Open('os_simu.html', self.simuHeadTranscript, self.simuTailTranscript, '<!--forMyOS.transcript::start-->','<!--forMyOS.transcript::end-->')
        self.head_tail_Open('formControl.js', self.simuHeadRuleset,self.simuTailRuleset,'//forMyOS.ruleset::start','//forMyOS.ruleset::end')

    def loadAOSFile(self):
        f = open('load.aos','r')

        for line in f:
            if('+-AllOritatamiSystemFormationFile' in line):
                break

        readings = []
        current_line = ''
        for line in f:
            if(';' in line):
                div_str = line.split(';',1)
                readings.append(current_line + div_str[0])
                current_line = div_str[1]
            else:
                current_line += line

        it_read = iter(readings)
        for line in it_read:
            if('+Rule Set' in line):
                self.read_ruleset(line)

            elif('+Transcript' in line):
                self.read_transcript(line)

            elif('===output formation number is' in line):
                self.read_initial(line,it_read)
                break

    def read_ruleset(self, line):
        div_str = line.split('-')
        div_str.pop(0)

        for el in div_str:
            div2 = el.split('=')
            div3 = div2[1].replace('[',' ').replace(']:', ' ').split(',')

            r1 = div2[0].strip()
            if(r1.isdigit()):
                for el2 in div3:
                    r2 = el2.strip()
                    if(r2.isdigit()):
                        self.ruleset.append((r1,r2))

    def read_transcript(self, line):
        div_str = line.split('=',1)
        div2 = div_str[1].replace('{' , ' ').replace('}' , ' ').split(',')
        for el in div2:
            tr = el.strip()
            if(tr.isdigit()):
                self.transcript.append(tr)

    def read_initial(self, line, it):
        marginx = 20
        marginy = 20

        cont = True
        stX = None
        stY = None
        beads = None
        for el in it:
            if('===output formation number is' in el):
                cont = True

            if(cont):
                if('startX' in el):
                    x = el.split('=',1)[1]
                    x = x.strip()
                    if(x.isdigit()):
                        stX = int(x) + marginx

                elif('startY' in el):
                    y = el.split('=',1)[1]
                    y = y.strip()
                    if(y.isdigit()):
                        stY = int(y) + marginy

                elif('initialBeads' in el):
                    init_b = el.split('=',1)[1].replace('}','')
                    be = init_b.replace(')',' ').split('(')

                    beads = []

                    for el2 in be:
                        cel = el2.split(',')
                        if(len(cel) > 2):
                            beads.append( ( int(cel[0].strip()) + marginx + int(cel[1].strip()) ,int(cel[1].strip()) + marginy,cel[2].strip()) )
                    if(stX is not None and stY is not None):
                        self.initial.append( (stX+stY-marginy,stY,beads) )
                        stX = None
                        stY = None
                        beads = None

                    cont = False

    def head_tail_Open(self, file_name, head, tail, startString, endString):
        f = iter(open(file_name,'r'))

        for line in f:
            check_str = line.lstrip()

            if(check_str.startswith(startString)):
                break

            line = line.replace('\r','')
            line = line.replace('\n','')
            head.append(line)

        for line in f:
            check_str = line.lstrip()
            if(check_str.startswith(endString)):
                break

        for line in f:
            line = line.replace('\r','')
            line = line.replace('\n','')
            tail.append(line)


if __name__ == '__main__':
    loader = LoadData()

    loader.loadSimuFile()
    loader.loadAOSFile()

    loader.makeDir()
    loader.readyToWrite()
    loader.writeFiles()
